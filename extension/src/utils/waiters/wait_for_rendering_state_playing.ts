import { NetflixDebugMenu } from "../netflix/NetflixDebugMenu"
import { extract_rendering_state } from "../debug_menu_analysis"


/**
 * Blocking function. Block code execution until DebugMenu's rendering_state property switches to "Playing" 
 * @returns {void}
*/
export const wait_for_rendering_state_playing = async () : Promise<void> => {
    const element = await NetflixDebugMenu.get_html_element()
    let retry_interval : ReturnType<typeof setInterval>
    
    console.log("Waiting for rendering state - playing")
    return new Promise(resolve => {
        retry_interval = setInterval(() => {
            const rendering_state = extract_rendering_state(element.value)
            if(rendering_state?.toLowerCase() === "playing"){
                clearInterval(retry_interval)
                console.log("Rendering state - playing. Resolving...")
                resolve()
            }
        }, 100)
    })
}

