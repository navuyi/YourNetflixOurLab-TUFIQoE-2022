import {STORAGE_KEYS} from "../../config"
import { get_statistics_element } from "./get_statistics_element"


export class StatsRecorder{
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
            }
            else{
                this.print(`Killing interval. Not my session anymore: ${this.sessionIndex} vs ${currentIndex}`)
                clearInterval(this.interval)
            }
        }, 1000)
    }

    
}