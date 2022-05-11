import {simulate_bitrate_menu_hotkey} from "../utils/bitrate_menu_hotkey";
import {get_statistics_element} from "../utils/get_statistics_element";

export class BitrateManager{
    constructor() {
        this.bitrate_menu = undefined
    }




    async init(){
        await this.bitrate_menu_init()

        // Start regular bitrate changes
        setInterval(async () => {
            console.log("Changing bitrate")
            return new Promise((resolve) => {
                let timer = undefined

                simulate_bitrate_menu_hotkey()
                timer = setInterval(() => {
                    try{
                        const {bitrate_values, select, override_button} = this.get_html_elements()
                        console.log(`Available bitrate values: ${bitrate_values}`)
                        if(bitrate_values.length > 0){
                            clearInterval(timer)
                            const random_bitrate = bitrate_values[Math.floor(Math.random()*bitrate_values.length)]
                            setTimeout(() => {
                                this.set_bitrate(select, override_button, random_bitrate)
                            }, 2000)
                            resolve(true)
                        }
                    }
                    catch (err){
                        console.log(err)
                    }
                }, 500)
            })
        }, 120000)
    }




    /**
     *  This function is executed on BitrateManager init, only once, it prepares bitrate
     *  menu for work and returns available bitrate values to the BackgroundScript
    */
    async bitrate_menu_init(){
        return new Promise((resolve) => {
            let timer = undefined

            timer = setInterval(() => {
                // Simulate bitrate menu hotkey
                simulate_bitrate_menu_hotkey()

                try{
                    const {container, bitrate_values, select, override_button} = this.get_html_elements()

                    // Set opacity of the element to required value
                    container.style.opacity = "0.5" //TODO change it later to 0

                    if(bitrate_values.length > 0){
                        clearInterval(timer)
                        setTimeout(() => {
                            this.set_bitrate(select, override_button, bitrate_values[bitrate_values.length-1])
                        }, 2000)
                        resolve(bitrate_values)
                    }
                }
                catch (err){
                    console.log(err)
                }
            }, 500)
        })
    }

    get_html_elements(){
        // Get outter menu container
        const container = [...document.querySelectorAll("div")].filter(item => item.textContent.match("Video Bitrate"))[1]
        const override_button = [...document.querySelectorAll("button")].filter(button => button.innerText.match("Override"))[0]

        // Get bitrate menu container
        const bitrate_menu_div = container.childNodes[1]
        const select = bitrate_menu_div.childNodes[1]
        const options = Array.from(bitrate_menu_div.childNodes[1].childNodes)
        const bitrate_values = Array.from(bitrate_menu_div.childNodes[1].childNodes).map(option => {return parseInt(option.innerText)})

        return {
            container: container,
            override_button: override_button,
            select: select,
            options: options,
            bitrate_values: bitrate_values
        }
    }

    /**
     * This method returns <option> elements responsible for
     * changing current bitrate value
     */
    async get_bitrate_options(){
        return new Promise((resolve) => {
            let timer = undefined
            timer = setInterval(() => {
                simulate_bitrate_menu_hotkey()
                try{
                    // Get outter menu container
                    const container = [...document.querySelectorAll("div")].filter(item => item.textContent.match("Video Bitrate"))[1]

                    // Get bitrate menu container
                    const bitrate_menu_div = container.childNodes[1]
                    const options = Array.from(bitrate_menu_div.childNodes[1].childNodes)

                    if(options.length > 0){
                        clearInterval(timer)
                        resolve(options)
                    }
                }catch (err){
                    console.log(err)
                }

            }, 1000)
        })
        return [1,2,3,4]
    }


    async set_bitrate(select, button, value) {
        setTimeout(()=> {
            console.log(`Setting bitrate to ${value} kbps`)
            select.value = value
            button.click()
        }, 1000)
    }
}