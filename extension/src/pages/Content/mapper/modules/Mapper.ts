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
import { T_MESSAGE } from "../../../../config/messages.config"
import { MESSAGE_HEADERS } from "../../../../config/messages.config"

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
            await NetflixBitrateMenu.set_bitrate(bitrate)

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
            }, 500)
        })
    }

    private finalize = async () : Promise<void> => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        
        // Generate Bitrate-VMAF scenario for the video // AFTER UPDATING CONFIGURATION
        if(!settings.config) return

        const scenario = ScenarioGenerator.generate_video_scenario(settings.config.videos[variables.video_index])
        settings.config.videos[variables.video_index].scenario = scenario
        await ChromeStorage.set_experiment_settings(settings)

        // Update storage if mapping is finished
        const mapping_finished = variables.video_index > settings.config.videos.length
        if(mapping_finished){
            variables.video_index = -1
            variables.experiment_running = false
            await ChromeStorage.set_experiment_variables(variables)
        }

        // Redirect to next video or setup screen
        const msg : T_MESSAGE = {
            header: MESSAGE_HEADERS.REDIRECT,
            data: {
                url: mapping_finished ? "setup.html" : settings.config.videos[variables.video_index+1].url
            }
        }
        chrome.runtime.sendMessage(msg)        
    }
}



export default Mapper