import { simulate_bitrate_menu_hotkey } from "./bitrate_menu_hotkey"

/**
 * Function executes subfunction in intervals until bitrate menu elements are retrieved 
 * and HTML elements are extracted using extract_html_elements method
*/
const get_bitrate_menu_elements = async () => {
    return new Promise((resolve) => {
        let timer = undefined

        timer = setInterval(() => {
            // Simulate bitrate menu hotkey
            simulate_bitrate_menu_hotkey()
            try{
                const  {container, override_button, reset_button, select, options, bitrate_values} = extract_html_elements()

                // Set opacity of the element to required value
                if(bitrate_values.length > 0){
                    container.style.opacity = "0.5" //TODO change it later to 0
                    clearInterval(timer)
                    resolve({container, override_button, reset_button, select, options, bitrate_values})
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
const extract_html_elements = () => {
    // Get outter menu container
    const container = [...document.querySelectorAll("div")].filter(item => item.textContent.match("Video Bitrate"))[1]
    const override_button = [...document.querySelectorAll("button")].filter(button => button.innerText.match("Override"))[0]
    const reset_button = [...document.querySelectorAll("button")].filter(button => button.innerText.match("Reset"))[0]

    // Get bitrate menu container
    const bitrate_menu_div = container.childNodes[1]
    const select = bitrate_menu_div.childNodes[1]
    const options = Array.from(bitrate_menu_div.childNodes[1].childNodes)
    const bitrate_values = Array.from(bitrate_menu_div.childNodes[1].childNodes).map(option => {return parseInt(option.innerText)})

    return {
        container: container,
        override_button: override_button,
        reset_button: reset_button,
        select: select,
        options: options,
        bitrate_values: bitrate_values
    }
}



export default get_bitrate_menu_elements