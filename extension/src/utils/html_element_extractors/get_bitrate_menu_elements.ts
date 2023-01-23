import { T_BITRATE_MENU_ELEMENTS } from "../netflix/NetflixBitrateMenu.js"
import {simulate_bitrate_menu_hotkey} from "../keyboard_hotkeys/simulate_bitrate_menu_hotkeys.js"

/**
 * Function executes subfunction in intervals until bitrate menu elements are retrieved 
 * and HTML elements are extracted using extract_html_elements method
*/
export const invoke_bitrate_menu_and_get_html_elements = async () : Promise<T_BITRATE_MENU_ELEMENTS> => {
    return new Promise((resolve) => {
        let timer : ReturnType<typeof setInterval>

        timer = setInterval(() => {
            // Simulate bitrate menu hotkey
            simulate_bitrate_menu_hotkey()
            try{
                const bitrate_menu_elements = extract_html_elements()

                const bitrate_values = bitrate_menu_elements.bitrate_values
                const override_button = bitrate_menu_elements.override_button
                const reset_button = bitrate_menu_elements.reset_button

                // Set opacity of the element to required value
                if(bitrate_values.length > 0 && override_button != null && reset_button != null){
                    clearInterval(timer)
                    resolve(bitrate_menu_elements)
                }
            }
            catch (err){
                console.log(err)
            }
        }, 500)
    })
}


/**
 * Helper method used to extract HTML elemnets from DOM tree 
 * @returns{object} Object of key:values where values are HTML elements, possible to unpack
*/
export const extract_html_elements = () : T_BITRATE_MENU_ELEMENTS => {
    // Get outter menu container
    const container = Array.from(document.querySelectorAll("div")).filter(item => item.innerText.match("Video Bitrate"))[1]
    const override_button = Array.from(document.querySelectorAll("button")).filter(button => button.innerText.match("Override"))[0]
    const reset_button = Array.from(document.querySelectorAll("button")).filter(button => button.innerText.match("Reset"))[0]

    // Get bitrate menu container
    const bitrate_menu_div = container.childNodes[1]
    const select = bitrate_menu_div.childNodes[1] as HTMLSelectElement
    const options = Array.from(bitrate_menu_div.childNodes[1].childNodes) as Array<HTMLOptionElement>
    const bitrate_values = Array.from(bitrate_menu_div.childNodes[1].childNodes).map(option => {
        const o = option as HTMLOptionElement
        return parseInt(o.value)
    })

    return {
        container: container,
        override_button: override_button,
        reset_button: reset_button,
        select: select,
        options: options,
        bitrate_values: bitrate_values
    }
}



