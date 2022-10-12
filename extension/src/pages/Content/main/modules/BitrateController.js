import {BitrateMenu} from "../../utils/BitrateMenu";
import {CustomLogger} from "../../../../utils/CustomLogger";
import {STORAGE_KEYS} from "../../../config";
import {get_local_datetime} from "../../../../utils/time_utils";
import {send_bitrate} from "../../../../utils/http_requests/send_bitrate";
import BufferResetter from "./BufferResetter";


class BitrateController{
    constructor(scenario, interval, bitrate_menu, iterator) {
        this.scenario = scenario
        this.interval = interval
        this.iterator = iterator
        this.bitrate_menu = bitrate_menu

        this.logger = new CustomLogger("[BitrateController]")
        this.buffer_resetter = new BufferResetter()
    }

    async init(){
        await this.wait_for_video_to_load()

        await this.set_initial_bitrate()

        await this.buffer_resetter.reset()
    }

    async wait_for_video_to_load(){
        return new Promise((resolve) => {
            let interval = undefined
            interval = setInterval(async () => {
                try {
                    const video = document.getElementsByTagName("video")[0]
                    const ltr_element = document.querySelectorAll("[data-uia='video-canvas']")[0]

                    if (video && ltr_element) {
                        clearInterval(interval) // stop the retrying process - must be first
                        this.logger.log("HTML video element is loaded. Proceeding...")
                        resolve()
                    }
                    else{
                        this.logger.log("Video element not found! Retrying...")
                    }
                } catch (err) {
                    this.logger.log(err)
                }
            }, 100)
        })
    }

    async set_initial_bitrate() {
        const initial_settings = this.iterator.next().value
        this.logger.log("Setting initial bitrate value: " + initial_settings.bitrate)

        await this.execute_bitrate_change(initial_settings.bitrate)
    }

    async execute_bitrate_change(bitrate) {
        // Invoke bitrate menu
        await this.bitrate_menu.invoke_bitrate_menu()   // ESSENTIAL --> bitrate menu has to be invoked before simulating clicks and changing bitrate
        // Validate selected bitrate
        const bitrate_validated = this.bitrate_menu.check_bitrate_availability(bitrate)
        // Set bitrate
        await this.bitrate_menu.set_bitrate(bitrate_validated)
        // Send bitrate change update to backend server
        await this.send_bitrate_change_update(bitrate_validated)
    }

    /**
     * Prepares data and sends post request to REST API
     * with information on new bitrate change.
     * Also updates chrome.storage with current bitrate
     * @param {Number} bitrate
    */
    async send_bitrate_change_update(bitrate) {
        // Get previous bitrate and send update
        const res = await chrome.storage.local.get([STORAGE_KEYS.CURRENT_BITRATE, STORAGE_KEYS.DATABASE_VIDEO_ID])
        const bitrate_data = {
            video_id: res[STORAGE_KEYS.DATABASE_VIDEO_ID],
            previous: res[STORAGE_KEYS.CURRENT_BITRATE],
            timestamp: get_local_datetime(new Date()),
            value: bitrate
        }
        /*await */send_bitrate(bitrate_data) // <-- not waiting for response

        // Save new current bitrate value to chrome.storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.CURRENT_BITRATE]: bitrate
        })
    }
}


export default BitrateController