import { CONFIGURATION_KEYS, STORAGE_KEYS } from "../../../config";
import { BITRATE_INTERVAL } from "../../../config";
import { get_local_datetime } from "../../../../utils/time_utils";
import { send_bitrate } from "../../../../utils/http_requests/send_bitrate";
import { BitrateMenu } from "../../utils/BitrateMenu";
import { CustomLogger } from "../../../../utils/CustomLogger";

export class BitrateManager{
    private bitrate_menu: BitrateMenu | undefined
    private scenario : 

    constructor() {
        // BitrateMenu class instance
        this.bitrate_menu = undefined

        // Episode's scenario
        this.scenario = undefined

        // Scenario iterator
        this.iterator = undefined

        // Bitrate change interval - config fille
        this.bitrate_interval = undefined

        // Custom logger
        this.logger = new CustomLogger("[BitrateManager]")
    }

    
    async init(){
        // Create bitrate menu class instance
        this.bitrate_menu = new BitrateMenu()
        await this.bitrate_menu.init()

        // Prepare video's bitrate scenario
        await this.prepare_video_scenario()

        // Prepare bitrate interval
        await this.prepare_bitrate_interval()

        // Create iterator
        this.iterator = this.scenario_iterator()


        // Starting in 10 seconds to avoid CDNs change and bitrate reset
        setTimeout(async () => {
            // Set initial bitrate value
            await this.set_initial_bitrate()

            // Start bitrate changes
            await this.start_bitrate_changes_interval()
        }, 20000)
    }


    /**
     *  Method reads bitrate changes interval from config file. Provided in seconds has to be converted to ms. 
    */
    async prepare_bitrate_interval(){
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const interval_s = configuration[CONFIGURATION_KEYS.BITRATE_INTERVAL]

        if(interval_s != null && typeof(interval_s) == 'number'){
            this.bitrate_interval = 1000 * interval_s
            this.logger.log(`Configuration's bitrate change interval - OK, ${interval_s}s = ${this.bitrate_interval}ms`)
        }
        else{
            this.logger.log(`Configuration's bitrate change interval missing or incorrect. Using default interval`)
            this.bitrate_interval = BITRATE_INTERVAL
        }

        
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

        this.scenario = configuration[CONFIGURATION_KEYS.VIDEOS][video_index][CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO]
    }


    /**
     * Generator or iterator idk
     * Yields scenario's items in loop
    */
    *scenario_iterator(){
        let index = 0;
        while(true){
            this.logger.log("Yielding...")
            this.logger.log(this.scenario[index])
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
     *  Sets the initial bitrate value
     *  which is the first in video's escenario 
    */
    async set_initial_bitrate(){
        const initial_settings = this.iterator.next().value
        this.logger.log("Setting initial bitrate value: " + initial_settings.bitrate)

        await this.invoke_bitrate_change(initial_settings.bitrate)
    }


    /**
     * Starts bitrate changes in intervals
     * Bitrates are set according to the configuration's scenario for current video.
     * In case the provided bitrate is not available the closest available value will be applied.
     * Validation is part of BitrateMenu instance's methods
    */
    start_bitrate_changes_interval(){
        setInterval(async () => {  
            const current_settings = this.iterator.next().value    
            this.logger.log(`Setting bitrate to ${current_settings.bitrate}kbps which corresponds to VMAF ${current_settings.vmaf}`)
            this.logger.log(`VMAF template was ${current_settings.vmaf_template}. Difference: ${current_settings.vmaf_diff}`)
                
            await this.invoke_bitrate_change(current_settings.bitrate)
        }, this.bitrate_interval)
    }


    /**
     * Invokes bitrate change first by invoking the bitrate menu, then
     * validating provided bitrate and overriding playback bitrate with it.
     * Also sends bitrate change post request to the backend server.
     * @param {Number} bitrate 
    */
    async invoke_bitrate_change(bitrate){
        // Invoke bitrate menu - watch the method's body in BitrateMenu class
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