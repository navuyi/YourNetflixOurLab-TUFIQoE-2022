import { NetflixDebugMenu } from "../netflix/NetflixDebugMenu"
import {extract_buffering_bitrate_video} from "../debug_menu_analysis"


/**
 * Blocking function. Waits for expected bitrate to be buffered by Neflix player. 
 * @returns {void}
*/
export const wait_for_expected_bitrate_buffering = async (expected_bitrate : number) : Promise<void> => {
    const element = await NetflixDebugMenu.get_html_element()
    let retry_interval : ReturnType<typeof setInterval>
    
    console.log(`Waiting for expected bitrate to be buffered: ${expected_bitrate} kbps`)
    return new Promise(resolve => {
        retry_interval = setInterval(() => {
            const buffering_bitrate = extract_buffering_bitrate_video(element.value)
            if(Number(buffering_bitrate) === expected_bitrate){
                clearInterval(retry_interval)
                console.log("Expected bitrate is buffering. Resolving...")
                resolve()
            }
        }, 100)
    })
}





