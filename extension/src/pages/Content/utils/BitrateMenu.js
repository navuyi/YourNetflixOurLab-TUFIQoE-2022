import Mapper from "../mapper/modules/Mapper"
import { invoke_bitrate_menu_and_get_html_elements } from "./get_bitrate_menu_elements"

export class BitrateMenu{
    constructor(){
        this.bitrate_menu_elements = undefined

        this.available_bitrates = undefined
        this.override_button = undefined
        this.reset_button = undefined
        this.select = undefined
    }


    /**
     *  Invokes bitrate menu and assings bitrate menu's HTML elements 
     *  to instance attributes.
     *  Closes bitrate menu by simulating click event on Reset button.
    */
    async init(){
        await this.invoke_bitrate_menu()
        this.reset_button.click()   // Close bitrate menu after initialization is finished
    }


    /**
     *  Invokes bitrate_menu and reassigns HTML elements  
     *  Reassigning elements is important because bitrate menu is removed from DOM tree
     *  after overriding bitrate value or reseting
    */
    async invoke_bitrate_menu(){
        // Invoke bitrate menu and get html elements
        const elements = await invoke_bitrate_menu_and_get_html_elements()
        console.log(elements)

        this.bitrate_menu_elements = elements
        this.available_bitrates = this.bitrate_menu_elements.bitrate_values
        this.override_button = this.bitrate_menu_elements.override_button
        this.reset_button = this.bitrate_menu_elements.reset_button
        this.select = this.bitrate_menu_elements.select
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
    set_bitrate(bitrate){
        console.log(`Setting bitrate to: ${bitrate}`)
        this.select.value = bitrate
        this.override_button.click()
    }

    

}