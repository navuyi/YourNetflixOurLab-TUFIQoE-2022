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

        await this.set_bitrate()    // First bitrate set after video is loaded

        await this.buffer_resetter.reset()  // Navigating to the start and resetting buffer

        await this.set_bitrate()    // Second bitrate set after buffer is reset

        this.start_bitrate_change_interval()    // Scheduling the rest of bitrate changes using setInterval
    }

    /**
     * Method waits for the essential html elements to be loaded and available for manipulation.
     * @returns {Promise<unknown>}
    */
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

    /**
     * Universal method for setting the next bitrate value in order.
     * Order of bitrates is defined by video's scenario.
     * @returns {Promise<void>}
    */
    async set_bitrate() {
        const settings = this.iterator.next().value
        this.logger.log(`Setting bitrate to ${settings.bitrate}kbps which corresponds to VMAF ${settings.vmaf}`)
        this.logger.log(`VMAF template was ${settings.vmaf_template}. Difference: ${settings.vmaf_diff}`)

        await this.execute_bitrate_change(settings.bitrate)
    }

    /**
     * Executes bitrate change by invoking actual bitrate menu,
     * validating selected bitrate and overriding the settings
     * @param bitrate<number>
     * @returns {Promise<void>}
    */
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

    /**
     * Starts bitrate change interval
    */
    start_bitrate_change_interval(){
        setInterval(async () => {
            await this.set_bitrate()
        }, this.interval)
    }
}


export default BitrateController