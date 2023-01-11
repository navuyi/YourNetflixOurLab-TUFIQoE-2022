import { ScenarioGenerator } from "./ScenarioGenerator"
import { CustomLogger } from "../../../../utils/custom/CustomLogger"
import { NetflixPlayerAPI } from "../../../../utils/netflix/NetflixPlayerAPI"
import { NetflixDebugMenu } from "../../../../utils/netflix/NetflixDebugMenu"
import { extract_buffering_vmaf } from "../../../../utils/debug_menu_analysis"
import { extract_buffering_bitrate_video } from "../../../../utils/debug_menu_analysis"
import { T_BITRATE_VMAF_MAP_ITEM } from "../../../../config/types/data-structures.type"
import { NetflixBitrateMenu } from "../../../../utils/netflix/NetflixBitrateMenu"
import { wait_for_video_to_load } from "../../../../utils/waiters/wait_for_video_to_load"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"

class Mapper{
    private available_bitrates : Array<number>
    private bitrate_vmaf_map : Array<T_BITRATE_VMAF_MAP_ITEM>
   
    private logger : CustomLogger

    constructor(){
        this.available_bitrates = []
        this.bitrate_vmaf_map = []
        this.logger = new CustomLogger("[Mapper]")
    }


    public init = async () : Promise<void> => {
        // Get available bitrate values
        this.available_bitrates = await NetflixBitrateMenu.get_available_bitrates()//this.bitrate_menu.get_available_bitrates()
        this.logger.log(`Available bitrates: ${this.available_bitrates}`)

        await wait_for_video_to_load()
        NetflixPlayerAPI.set_video_muted(true)
        await this.create_map()
    }

    /**
     *  This method maps available bitrate values to vmaf.
    */ 
    private create_map = async () : Promise<void> => {
        for(const bitrate of this.available_bitrates){
            // Set next bitrate to be mapped
            await NetflixBitrateMenu.set_bitrate(bitrate)//this.bitrate_menu.set_bitrate(bitrate)

            // Wait for buffering bitrate and vmaf to change
            const map_item = await this.wait_for_change(bitrate)

            // Update general vmaf <-> bitrate map
            this.bitrate_vmaf_map.push(map_item)
        }

        this.logger.log(`Bitrate to vmaf mapping finished.`)
        this.logger.log(this.bitrate_vmaf_map)
        await this.finalize()
    }

   
    

    /**
     * Method observes nerd statistics's buffering VMAF and buffering video bitrate
     * in order to match it based on expected bitrate.
     * Method returns map item which is an object containing expected bitrate value and it's corresponding VMAF.
     * @param {number} expected_bitrate 
     * @returns {Object}
    */
    private wait_for_change = async (expected_bitrate:number) : Promise<T_BITRATE_VMAF_MAP_ITEM> => {
        return new Promise(resolve => {
            let interval : ReturnType<typeof setInterval>

            interval = setInterval(async () => {
                const debug_textarea = await NetflixDebugMenu.get_html_element()//this.statistics_menu.analyze_statistics_text()

                const buffering_vmaf = extract_buffering_vmaf(debug_textarea.value) //statistic_data[DATABASE_KEYS.BUFFERING_VMAF]
                const buffering_bitrate = extract_buffering_bitrate_video(debug_textarea.value) //statistic_data[DATABASE_KEYS.BUFFERING_BITRATE_VIDEO]

                this.logger.log(`Expected bitrate: ${expected_bitrate} --- Buffering bitrate: ${buffering_bitrate}`)
                
            
                if(expected_bitrate === Number(buffering_bitrate)){
                    this.logger.log(`Found VMAF <-> bitrate mapping. Resolving...`)
                    clearInterval(interval)
                    const map_item = {
                        bitrate: expected_bitrate,
                        vmaf: Number(buffering_vmaf)
                    }
                    resolve(map_item)
                }
            }, 1000)
        })
    }



    async finalize(){
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        
        // Generate Bitrate-VMAF scenario for the video // AFTER UPDATING CONFIGURATION
        const scenario_generator = new ScenarioGenerator(settings.config.videos[variables.video_index])
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
}



export default Mapper