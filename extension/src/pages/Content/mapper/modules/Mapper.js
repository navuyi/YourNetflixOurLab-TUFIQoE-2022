import { BitrateMenu } from "../../utils/BitrateMenu"
import { StatisticsMenu } from "../../utils/StatisticsMenu"
import { CONFIGURATION_KEYS, DATABASE_KEYS, MESSAGE_HEADERS, MESSAGE_TEMPLATE, STORAGE_KEYS } from "../../../config"
import { ScenarioGenerator } from "./ScenarioGenerator"
import { CustomLogger } from "../../../../utils/CustomLogger"


class Mapper{
    constructor(){
        this.interval = undefined
        this.available_bitrates = []
        this.bitrate_vmaf_map = []

        // BitrateMenu class instance
        this.bitrate_menu = undefined

        // StatisticsMenu class instance
        this.statistics_menu = undefined

        // CustomLogger instance
        this.logger = new CustomLogger("[Mapper]")
    }

    


    async init(){
        // Init BitrateMenu instance
        this.bitrate_menu = new BitrateMenu()
        await this.bitrate_menu.init()

        // Init StatisticsMenu instance
        this.statistics_menu = new StatisticsMenu()
        await this.statistics_menu.init()

        // Get available bitrate values
        this.available_bitrates = this.bitrate_menu.get_available_bitrates()
        this.logger.log(`Available bitrates: ${this.available_bitrates}`)

        // Start mapping
        await this.create_map()
    }


    /**
     *  This method maps available bitrate values to vmaf.
    */ 
    async create_map(){
        for(const bitrate of this.available_bitrates){
            // Invoke bitrate menu
            await this.bitrate_menu.invoke_bitrate_menu()
            // Set next bitrate to be mapped
            this.bitrate_menu.set_bitrate(bitrate)

            // Wait for buffering bitrate and vmaf to change
            // Code execution waits for this phase to resolve
            const map_item = await this.wait_for_change(bitrate)

            // Update general vmaf <-> bitrate map
            this.update_bitrate_vmaf_map(map_item)

        }

        this.logger.log(`Bitrate to vmaf mapping finished.`)
        this.logger.log(this.bitrate_vmaf_map)
        await this.finalize()
    }

   
    /**
     * Updates object with mapping results
     * @param {Object} map_item 
     */
    update_bitrate_vmaf_map(map_item){
        this.bitrate_vmaf_map.push(map_item)
    }

    /**
     * Method observes nerd statistics's buffering VMAF and buffering video bitrate
     * in order to match it based on expected bitrate.
     * Method returns map item which is an object containing expected bitrate value and it's corresponding VMAF.
     * @param {number} expected_bitrate 
     * @returns {Object}
    */
    async wait_for_change(expected_bitrate){
        return new Promise(resolve => {
            let interval;
            interval = setInterval(async ()=>{
                const statistic_data = this.statistics_menu.analyze_statistics_text()
                const buffering_vmaf = statistic_data[DATABASE_KEYS.BUFFERING_VMAF]
                const buffering_bitrate = statistic_data[DATABASE_KEYS.BUFFERING_BITRATE_VIDEO]

                this.logger.log(`Expected bitrate: ${expected_bitrate} --- Buffering bitrate: ${buffering_bitrate}`)
                
                if(parseInt(expected_bitrate) === parseInt(buffering_bitrate)){
                    this.logger.log(`Found VMAF <-> bitrate mapping. Resolving...`)
                    clearInterval(interval)
                    const map_item = {
                        bitrate: parseInt(expected_bitrate),
                        vmaf: parseInt(buffering_vmaf)
                    }
                    resolve(map_item)
                }
            }, 1000)
        })
    }



    async finalize(){
        const storage = await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION, STORAGE_KEYS.VIDEO_COUNT, STORAGE_KEYS.VIDEO_LIMIT])

        // Fetch required information
        const configuration = storage[STORAGE_KEYS.CONFIGURATION]
        const video_count = storage[STORAGE_KEYS.VIDEO_COUNT]
        const video_limit = storage[STORAGE_KEYS.VIDEO_LIMIT]
        const video_index = video_count -1
        const videos = configuration.videos

        const MAPPING_FINISHED = video_count === video_limit


        // Update configuration with generated bitrate <-> vmaf map
        configuration.videos[video_index][CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP] = this.bitrate_vmaf_map
        

        // Generate Bitrate-VMAF scenario for the video // AFTER UPDATING CONFIGURATION
        const scenario_generator = new ScenarioGenerator(configuration.videos[video_index])
        const scenario = scenario_generator.generate_video_scenario()
        configuration.videos[video_index][CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO] = scenario

        
        // Update local storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.CONFIGURATION]: configuration,
        })


        // Update storage if mapping is finished
        if(MAPPING_FINISHED === true){
            await chrome.storage.local.set({
                [STORAGE_KEYS.VIDEO_COUNT]: 0,  // video_count is also used in experiment part
                [STORAGE_KEYS.RUNNING]: false
            })
        }

        // Redirect to next video or setup screen
        chrome.runtime.sendMessage({
            [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.REDIRECT,
            [MESSAGE_TEMPLATE.DATA]: {
                url: MAPPING_FINISHED ? "setup.html" : videos[video_index+1].url
            }
        })        
    }


    async redirect(){

    }

    
}



export default Mapper