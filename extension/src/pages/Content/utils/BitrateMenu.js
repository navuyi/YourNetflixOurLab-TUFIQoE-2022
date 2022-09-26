
import { CustomLogger } from "../../../utils/CustomLogger"
import { invoke_bitrate_menu_and_get_html_elements } from "./get_bitrate_menu_elements"
import { simulate_bitrate_menu_hotkey } from "./keyboard_hotkeys/simulate_bitrate_menu_hotkeys"

export class BitrateMenu{
    constructor(){
        this.bitrate_menu_elements = undefined

        this.available_bitrates = undefined
        this.override_button = undefined
        this.reset_button = undefined
        this.select = undefined

        this.logger = new CustomLogger("[BitrateMenu]")
    }


    /**
     *  Invokes bitrate menu and assings bitrate menu's HTML elements 
     *  to instance attributes.
     *  Closes bitrate menu by simulating click event on Reset button.
    */
    async init(){
        await this.invoke_bitrate_menu()
        //this.reset_button.click()   <-- alternative way of closing the menu but it also resets the bitrates
        simulate_bitrate_menu_hotkey() // Close bitrate menu after initialization is finished
    }


    /**
     *  Invokes bitrate_menu and reassigns HTML elements  
     *  Reassigning elements is important because bitrate menu is removed from DOM tree
     *  after overriding bitrate value or reseting
    */
    async invoke_bitrate_menu(){
        this.logger.log("Invoking bitrate menu...")
        // Invoke bitrate menu and get html elements
        const elements = await invoke_bitrate_menu_and_get_html_elements()
        this.logger.log(elements)

        this.bitrate_menu_elements = elements
        this.available_bitrates = this.bitrate_menu_elements.bitrate_values
        this.override_button = this.bitrate_menu_elements.override_button
        this.reset_button = this.bitrate_menu_elements.reset_button
        this.select = this.bitrate_menu_elements.select

        this.logger.log("Bitrate menu invoked.")
    }

    /**
     * Returns array of available bitrate values
     * @returns {Array.<number>} Available bitrate values
    */
    get_available_bitrates(){
        return this.available_bitrates
    }

    /**
     * Returns HTML elements of bitrate menu
     * @returns {Object.<HTMLElement>}
    */
    get_bitrate_menu_elements(){
        return this.bitrate_menu_elements
    }

    /**
     * Overrides current bitrate with new bitrate value
     * provided as a parameter
     * @param {number} bitrate 
    */
    async set_bitrate(bitrate){
        this.logger.log(`Setting bitrate to: ${bitrate}`)
        this.select.value = bitrate
        this.logger.log(`SELECTED BITRATE VALUE: ${this.select.value}`)
        this.override_button.click()   
    }

    /**
     * Method checks if provided bitrate is available in bitrate menu.
     * If it is then the same value is returned.
     * If not - the closest value is found and returned.
     * @param {Number} bitrate 
     * @returns {Number} Returns closest available bitrate to provided value
    */
    check_bitrate_availability(bitrate){
        if(this.available_bitrates.includes(bitrate)){
            return bitrate
        }
        else{
            this.logger.log("Provided bitrate is not available. Finding closest value...")
            const closest_bitrate = this.available_bitrates.reduce((prev, curr) => {
                return(Math.abs(curr-bitrate) < Math.abs(prev-bitrate) ? curr: prev)
            })
            this.logger.log(`Closest bitrate to ${bitrate} is ${closest_bitrate}`)
            return closest_bitrate
        }
    }
}