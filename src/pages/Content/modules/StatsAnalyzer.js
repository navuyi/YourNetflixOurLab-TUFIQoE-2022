import {MESSAGE_FORMAT, MESSAGE_HEADERS, STORAGE_KEYS} from "../../config"
import { get_statistics_element } from "./get_statistics_element"
import { STATS_RECORD_INTERVAL_MS } from "../../config"
import {get_local_datetime} from "../../../utils/time_utils"


export class StatsAnalyzer{
    constructor(){
        this.sessionIndex = undefined
        this.element = undefined
        this.interval = undefined
    }

    print(text){
        console.log(`[StatsRecorder] ${text}`)
    }

    async init(){
        // Assign SESSION_INDEX
        this.sessionIndex = (await chrome.storage.local.get([STORAGE_KEYS.SESSION_INDEX]))[STORAGE_KEYS.SESSION_INDEX]

        // Get statistics element to be analyzed
        this.element = await get_statistics_element()

        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(async () => {
            const currentIndex = (await chrome.storage.local.get([STORAGE_KEYS.SESSION_INDEX]))[STORAGE_KEYS.SESSION_INDEX]
            if(currentIndex === this.sessionIndex){
                this.print(`Gathering data this is my session: ${this.sessionIndex}`)
                const data = await this.analyze_data(this.element.value.toString())
                this.send_data_to_background(data)
            }
            else{
                this.print(`Killing interval. Not my session anymore: ${this.sessionIndex} vs ${currentIndex}`)
                clearInterval(this.interval)
            }
        }, STATS_RECORD_INTERVAL_MS)
    }


    analyze_data = (data) => {
        //TODO - make it to arrays format, so it takes less space
        //TODO - also continue with fetching more values 
        const result = {
            position: this.get_value("(Position:) ([0-9]+.[0-9]+)", 2, data),
            volume: this.get_value("(Volume:) ([0-9]+)(%)", 2, data),
            segment_position: this.get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, data),
            
            player_state: this.get_value("(Player state: )([a-zA-Z]+)", 2, data),
            buffering_state: this.get_value("(Buffering state: )([a-zA-Z]+)", 2, data),
            rendering_state: this.get_value("(Rendering state: )([a-zA-Z]+)", 2, data),
            
            timestamp: get_local_datetime(new Date())
        }

        result.session_index = this.sessionIndex
        return result
    } 
    
    get_value = (regex, group, data) => {
        let value = null
        try{
            value = data.match(regex)[group] ?? null
        }
        catch(e){
            console.log("No value")
        }
        return value
    }

    async send_data_to_background(data){
        chrome.runtime.sendMessage({
            [MESSAGE_FORMAT.HEADER]: MESSAGE_HEADERS.NERD_STATISTICS,
            [MESSAGE_FORMAT.DATA]: data
        })
    }
    

    
}