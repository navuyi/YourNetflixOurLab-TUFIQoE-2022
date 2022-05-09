import {simulate_bitrate_menu_hotkey} from "../utils/bitrate_menu_hotkey";

export class BitrateManager{
    constructor() {
        this.bitrate_menu = undefined
    }




    async init(){
        const bitrate_values = await this.bitrate_menu_init()
        //TODO send bitrate values to the BackgroundScript just to save it
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
                    // Get outter menu container
                    const container = [...document.querySelectorAll("div")].filter(item => item.textContent.match("Video Bitrate"))[1]
                    const override_button = [...document.querySelectorAll("button")].filter(button => button.innerText.match("Override"))[0]
                    console.log(override_button)

                    // Set opacity of the element to required value
                    container.style.opacity = "0.5" //TODO change it later to 0

                    // Get bitrate menu container
                    const bitrate_menu_div = container.childNodes[1]
                    const select = bitrate_menu_div.childNodes[1]
                    const options = Array.from(bitrate_menu_div.childNodes[1].childNodes)
                    const bitrates = Array.from(bitrate_menu_div.childNodes[1].childNodes).map(option => {return parseInt(option.innerText)})


                    if(bitrates.length > 0){
                        clearInterval(timer)
                        setTimeout(() => {
                            this.set_bitrate(select, override_button, bitrates[0])
                        }, 2000)
                        resolve(bitrates)
                    }
                }
                catch (err){
                    console.log(err)
                }
            }, 500)
        })
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
            select.value = value
            button.click()
        }, 1000)
    }
}