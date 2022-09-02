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
     *  Init method invokes bitrate menu and assings html elements and 
     *  other information.
     *  Bitrate menu is closed in the end.
    */
    async init(){
        await this.invoke_bitrate_menu()
        this.reset_button.click()   // Close bitrate menu after initialization is finished
    }


    /**
     *  Makes bitrate_menu visible and reassigns values  
     *   
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

    get_available_bitrates(){
        return this.available_bitrates
    }
    get_bitrate_menu_elements(){
        return this.bitrate_menu_elements
    }

    set_bitrate(bitrate){
        console.log(`Setting bitrate to: ${bitrate}`)
        this.select.value = bitrate
        this.override_button.click()
    }

    

}