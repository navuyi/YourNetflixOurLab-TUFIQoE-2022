import { CONFIGURATION_KEYS, STORAGE_KEYS } from "../../../config";
import { BITRATE_CHANGE_INTERVAL } from "../../../config";
import { get_local_datetime } from "../../../../utils/time_utils";
import { send_bitrate } from "../../../../utils/http_requests/send_bitrate";
import { invoke_bitrate_menu_and_get_html_elements } from "../../utils/get_bitrate_menu_elements";
import { BitrateMenu } from "../../utils/BitrateMenu";

export class BitrateManager{
    constructor() {
        // BitrateMenu class instance
        this.bitrate_menu = undefined

        this.scenario = undefined
    }

    async init(){
        // Create bitrate menu class instance
        this.bitrate_menu = new BitrateMenu()
        await this.bitrate_menu.init()

        // Prepare video's bitrate scenario
        await this.prepare_video_scenario()

        // Start bitrate changes
        await this.start_bitrate_changes()
    }

    /**
     *  Method prepares scenario for current video.
     *  Fetches configuration from chrome.storage 
    */
    async prepare_video_scenario(){
        const storage = await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION, STORAGE_KEYS.VIDEO_COUNT])
        const configuration = storage[STORAGE_KEYS.CONFIGURATION]
        const video_count = storage[STORAGE_KEYS.VIDEO_COUNT]
        const video_index = video_count - 1

        const scenario = configuration[CONFIGURATION_KEYS.VIDEOS][video_index][CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO]
        this.scenario = scenario
    }

    /**
     * Generator or iterator idk
     * Yields scenario's items in loop
    */
    *scenario_iterator(){
        let index = 0;
        while(true){
            console.log(`Yielding...`)
            console.log(this.scenario[index])
            yield this.scenario[index]
            if(index >= this.scenario.length -1){
                index = 0
            }
            else{
                index += 1
            }
        }
    }


    /**
     * Starts bitrate changes in intervals
     * Bitrates are set according to the configuration's scenario for current video.
     * In case the provided bitrate is not available the closest available value will be applied.
     * Validation is part of BitrateMenu instance's methods
    */
    start_bitrate_changes(){
        // Start regular bitrate changes
        const iterator = this.scenario_iterator()

        setInterval(async () => {  
            const current_settings = iterator.next().value    
            console.log(`Setting bitrate to ${current_settings.bitrate}kbps which corresponds to VMAF ${current_settings.vmaf}`)
            console.log(`VMAF template was ${current_settings.vmaf_template}. Difference: ${current_settings.vmaf_diff}`)
                
            const bitrate_validated = await this.bitrate_menu.set_bitrate(current_settings.bitrate)
            await this.send_bitrate_change_update(bitrate_validated)
        }, BITRATE_CHANGE_INTERVAL)
    }


    

    /**
     * Prepares data and sends post request to REST API
     * with information on new bitrate change.
     * Also updates chrome.storage with current bitrate
     * @param {number} bitrate 
    */
    async send_bitrate_change_update(bitrate){
        // Get previous bitrate and send update
        const res = await chrome.storage.local.get([STORAGE_KEYS.CURRENT_BITRATE, STORAGE_KEYS.DATABASE_VIDEO_ID])
        const bitrate_data = {
            video_id: res[STORAGE_KEYS.DATABASE_VIDEO_ID],
            previous: res[STORAGE_KEYS.CURRENT_BITRATE],
            timestamp: get_local_datetime(new Date()),
            value: bitrate
        }
        send_bitrate(bitrate_data)

        // Save new current bitrate value to chrome.storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.CURRENT_BITRATE]: bitrate
        })
    }
}