import { get_local_datetime } from "../../../../utils/time_utils"
import { post_playback_data} from "../../../../utils/http_requests/post-playback-data"
import { CustomLogger } from "../../../../utils/custom/CustomLogger"
import { NetflixDebugMenu } from "../../../../utils/netflix/NetflixDebugMenu"
import { extract_debug_menu_data } from "../../../../utils/debug_menu_analysis"
import { T_DEBUG_DATA_PROCESSED, T_DEBUG_DATA_RAW } from "../../../../config/types/data-structures.type"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { NetflixPlayerAPI } from "../../../../utils/netflix/NetflixPlayerAPI"
import { patch_video_ended } from "../../../../utils/http_requests/patch-video-ended"
import { MESSAGE_HEADERS } from "../../../../config/messages.config"
import { T_MESSAGE } from "../../../../config/messages.config"
import { patch_experiment_ended } from "../../../../utils/http_requests/patch_experiment_ended"

export class DebugMenuAnalyzer{
    private logger : CustomLogger
    private debug_menu : HTMLTextAreaElement | undefined
    private interval : ReturnType<typeof setInterval> | undefined

    constructor(){
        this.logger = new CustomLogger("[DebugMenuAnalyzer]")
    }

    public init = async () : Promise<void> => {
        this.logger.log(`Initializing...`)
        this.debug_menu = await NetflixDebugMenu.get_html_element()
        await this.start_debug_menu_recording()
    }

    private start_debug_menu_recording = async () : Promise<void> => {
        const settings = await ChromeStorage.get_experiment_settings()

        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(async () => {
            // Check if debug menu is defined
            if(!this.debug_menu) return;
            
            const timestamp = get_local_datetime(new Date())
            const data : T_DEBUG_DATA_PROCESSED = extract_debug_menu_data(this.debug_menu.value, timestamp)
            const archive : T_DEBUG_DATA_RAW = {
                data: this.debug_menu.value,
                timestamp: timestamp
            }

            // Send playback data to backend
            // Not using await --> not waiting for response
            /*await*/post_playback_data(data, archive)
            
            // Check if credits are available and remove container
            await this.check_video_finished()
        }, settings.stats_record_interval_ms)
    }

    private check_video_finished = async () : Promise<void> => {
        const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]
        const player_space = document.getElementsByClassName("PlayerSpace")[0]
        const back_to_browse = document.getElementsByClassName("BackToBrowse")[0]

        // Click watch credits in case of common series episode
        if([outer_container, player_space, back_to_browse].some(el => el != null)){
            // Clear analyze interval
            clearInterval(this.interval)

            // Pause video
            NetflixPlayerAPI.pause_video()

            // Simulate click on watch-credits-button in order to avoid default Netflix behaviour
            if(outer_container){
                const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0] as HTMLButtonElement
                credits_button.click()
                outer_container.remove() 
            }

            // Update finished video
            const variables = await ChromeStorage.get_experiment_variables()
            const settings = await ChromeStorage.get_experiment_settings()
            
            // Update current video finished time
            await patch_video_ended(variables.database_video_id)
            
            // Increment video_index
            variables.video_index += 1
            await ChromeStorage.set_experiment_variables(variables)

            // Check if experiment has finished
            if(variables.video_index === settings.videos.length!){
                await patch_experiment_ended(variables.database_experiment_id)
            }

            // Send msg with FINISHED header in order to navigate to break page // cannot use window.location.href, page must be found within extension bundle
            chrome.runtime.sendMessage({header: MESSAGE_HEADERS.FINISHED} as T_MESSAGE)
        }
    }
}