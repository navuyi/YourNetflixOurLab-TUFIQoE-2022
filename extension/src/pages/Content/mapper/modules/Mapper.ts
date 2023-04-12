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
import { save_json } from "../../../../utils/save_json"

class Mapper{
    private available_bitrates : Array<number>
    private logger : CustomLogger

    constructor(){
        this.available_bitrates = []
        this.logger = new CustomLogger("[Mapper]")
    }


    public init = async () : Promise<void> => {
        await wait_for_video_to_load()
        // Get available bitrate values
        this.available_bitrates = await NetflixBitrateMenu.get_available_bitrates()//this.bitrate_menu.get_available_bitrates()
        this.logger.log(`Available bitrates: ${this.available_bitrates}`)

        NetflixPlayerAPI.set_video_muted(true)
        await this.create_map()
    }

    /**
     *  This method maps available bitrate values to vmaf.
    */ 
    private create_map = async () : Promise<void> => {
        const bitrate_vmaf_map : Array<T_BITRATE_VMAF_MAP_ITEM> = []
        console.log(this.available_bitrates)
        for(const bitrate of this.available_bitrates){
            // Set next bitrate to be mapped
            await NetflixBitrateMenu.set_bitrate(bitrate)

            // Wait for buffering bitrate and vmaf to change
            const map_item = await this.wait_for_change(bitrate)

            // Update general vmaf <-> bitrate map
            bitrate_vmaf_map.push(map_item)
        }

        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        if(settings.videos == null){
            this.logger.log("Config file was not loaded and is null. Cannot proceed.")
            return
        }

        this.logger.log(`Bitrate to vmaf mapping finished.`)
        // Updates proceeded video's bitrate-vmaf map
        settings.videos[variables.video_index].bitrate_vmaf_map = bitrate_vmaf_map
        await ChromeStorage.set_experiment_settings(settings)
        // Finalize process
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
        
        // Generate scenario for the video 
        if(!settings.videos) return;
        const scenario = ScenarioGenerator.generate_video_scenario(settings.videos[variables.video_index])
        settings.videos[variables.video_index].scenario = scenario
        await ChromeStorage.set_experiment_settings(settings)


        // Increment video_index before redirecting
        variables.video_index += 1
        await ChromeStorage.set_experiment_variables(variables)

        if(variables.video_index < settings.urls.length){
            this.logger.log("Mapping in progress. Proceding to next video")
            window.location.href = settings.urls[variables.video_index]
        }
        else{
            this.logger.log("Mapping finished")
            variables.video_index = 0
            variables.extension_running = false
            await ChromeStorage.set_experiment_variables(variables)
            save_json(settings.videos, "complete_config.json")

            const msg : T_MESSAGE = {
                header: MESSAGE_HEADERS.REDIRECT,
                data: {
                    url: "setup.html"
                }
            }
            chrome.runtime.sendMessage(msg)   
        }
    }
}



export default Mapper