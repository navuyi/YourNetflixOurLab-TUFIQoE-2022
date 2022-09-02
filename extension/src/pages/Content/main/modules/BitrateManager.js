import { STORAGE_KEYS } from "../../../config";
import { BITRATE_CHANGE_INTERVAL } from "../../../config";
import {get_local_datetime} from "../../../../utils/time_utils";
import { send_bitrate } from "../../../../http_requests/send_bitrate";
import { invoke_bitrate_menu_and_get_html_elements } from "../../utils/get_bitrate_menu_elements";

export class BitrateManager{
    constructor() {
        // BitrateMenu class instance
        this.bitrate_menu = undefined
        

        // Variables used in sequential change mode
        this.current_bitrate_index = undefined
        this.max_bitrate_index = undefined
    }

    
    async init(){
        await this.bitrate_menu_init()
        await this.start_bitrate_changes()
    }


    /**
     *  This function is executed on BitrateManager init, only once
     *  It sets initial bitrate value.
    */
    async bitrate_menu_init(){
        const {bitrate_values, select, override_button} = await invoke_bitrate_menu_and_get_html_elements()
           
        const last_index = bitrate_values.length-1
        this.current_bitrate_index = last_index
        this.max_bitrate_index = last_index
        const value = bitrate_values[last_index]

        this.set_bitrate(select, override_button, value)
    }


    /**
     * Starts bitrate changes in intervals
     * Way of setting bitrate deppends on config file
     * Watch BITRATE_MODE in config.js --> random or sequential are available for now
    */
    start_bitrate_changes(){
        // Start regular bitrate changes
        setInterval(async () => {  
            const {bitrate_values, select, override_button} = await invoke_bitrate_menu_and_get_html_elements()
            console.log(`Available bitrate values: ${bitrate_values}`)

            const bitrate_mode = (await chrome.storage.local.get([STORAGE_KEYS.BITRATE_MODE]))[STORAGE_KEYS.BITRATE_MODE]
                        
            console.log(`[BitrateManager] Starting bitrate changes in ${bitrate_mode} mode`)

            let bitrate_to_be_set = undefined
            if(bitrate_mode === "random"){
                bitrate_to_be_set = this.get_next_bitrate_random(bitrate_values)
            }
            else if(bitrate_mode === "sequential"){
                bitrate_to_be_set = this.get_next_bitrate_sequential(bitrate_values)
            }
            
                                    
            await this.set_bitrate(select, override_button, bitrate_to_be_set)
            await this.send_bitrate_change_update(bitrate_to_be_set)
        }, BITRATE_CHANGE_INTERVAL)
    }


    /** 
     * Returns next bitrate value in random manner 
     * @param {Array} bitrate_values 
     * @returns {number}
     */
     get_next_bitrate_random(bitrate_values){
        return bitrate_values[Math.floor(Math.random()*bitrate_values.length)]
    }

    /**
     * Returns next bitrate value in sequential manner
     * Keeps track of current index of available bitrate values
     * @param {Array} bitrate_values 
     * @returns {number}
     */
    get_next_bitrate_sequential(bitrate_values){
        const next_index = this.current_bitrate_index + 1
        if(next_index > this.max_bitrate_index){
            this.current_bitrate_index = 0
        }
        else{
            this.current_bitrate_index = next_index
        }

        return bitrate_values[this.current_bitrate_index]
    }



    /**
     * Sets actual bitrate value by simulating click event on proper HTML element
     * @param {HTMLElement} select 
     * @param {HTMLElement} button 
     * @param {number} value 
    */
    set_bitrate(select, button, bitrate) {
        return new Promise(resolve => {
            setTimeout(async ()=> {
                console.log(`Setting bitrate to ${bitrate} kbps`)
                select.value = bitrate
                button.click()  // <-- the change happens after click event is dispatched

                resolve()
            }, 1000)
        })
       
    }

    /**
     * Prepares data and sends post request to REST API
     * with information on new bitrate change.
     * Also updates chrome.storage with current bitrate
     * @param {number} bitrate 
    */
    async send_bitrate_change_update(bitrate){
        // Get previous bitrate and send update
        const res = await chrome.storage.local.get([STORAGE_KEYS.CURRENT_BITRATE, STORAGE_KEYS.DATABASE_VIDEO_ID])
        const bitrate_data = {
            video_id: res[STORAGE_KEYS.DATABASE_VIDEO_ID],
            previous: res[STORAGE_KEYS.CURRENT_BITRATE],
            timestamp: get_local_datetime(new Date()),
            value: bitrate
        }
        send_bitrate(bitrate_data)

        // Save new current bitrate value to chrome.storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.CURRENT_BITRATE]: bitrate
        })
    }
}