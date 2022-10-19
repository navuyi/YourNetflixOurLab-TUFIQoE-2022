import {ARCHIVE_KEYS, MESSAGE_TEMPLATE, MESSAGE_HEADERS, STORAGE_KEYS} from "../../../config"
import { STATS_RECORD_INTERVAL_MS } from "../../../config"
import { get_local_datetime } from "../../../../utils/time_utils"
import { DATABASE_KEYS } from "../../../config"
import { get_statistics_element } from "../../utils/get_statistics_element"
import { send_playback_data } from "../../../../utils/http_requests/send_playback_data"
import { StatisticsMenu } from "../../utils/StatisticsMenu"
import { CustomLogger } from "../../../../utils/CustomLogger"



export class StatsAnalyzer{
    constructor(){
        this.interval = undefined
        this.stats_menu = undefined

        this.logger = new CustomLogger("[StatsAnalyzer]")
    }

    

    async init(){
        this.logger.log(`Initializing...`)

        // Create StatisticsMenu class instance
        this.stats_menu = new StatisticsMenu()
        await this.stats_menu.init()

        // Start recording playback statistics
        await this.start_recording()
    }

    async start_recording(){
        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(async () => {
            
            const timestamp = get_local_datetime(new Date())

            const data = this.stats_menu.analyze_statistics_text()
            data[DATABASE_KEYS.TIMESTAMP] = timestamp

            const archive = this.compile_archive(this.stats_menu.get_statistics_text(), timestamp)

            // Send playback data to backend
            // Not using await --> not waiting for response
            /*await*/send_playback_data(data, archive)
            
            // Check if credits are available and remove container
            await this.are_credits_available()
        }, STATS_RECORD_INTERVAL_MS)
    }


    compile_archive = (data, timestamp) => {
        return {
            [ARCHIVE_KEYS.DATA]: data,
            [ARCHIVE_KEYS.TIMESTAMP]: timestamp
        }
    }


    /**
     * This method checks if certain HTML elements are available in DOM tree.
     * Their availability indicates that serie's video is about to end and credits are present.
     * If elements are detected video playback ends and subject is redirected to custom extension's web page
    */
    async are_credits_available(){ 
        const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]

        //data-uia = "watch-credits-seamless-button"
        // data-uia="next-episode-seamless-button"
        
        // Checking PlayerSpace class element in case of last episode of the last season
        const player_space = document.getElementsByClassName("PlayerSpace")[0]

        // This element is displayed when last video of last season is played or a standalone movie
        const back_to_browse = document.getElementsByClassName("BackToBrowse")[0]

        if(back_to_browse){
            clearInterval(this.interval)

            // Pause the video
            document.getElementsByTagName("video")[0].pause()

            // Send FINISHED signal to the BackgroundScript
            await chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.FINISHED,
                [MESSAGE_TEMPLATE]: true
            })
        }
        else if(player_space){
            // Stop analyzing
            clearInterval(this.interval)

            // Pause the video
            document.getElementsByTagName("video")[0].pause()

            // Send FINISHED signal to the BackgroundScript
            await chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.FINISHED,
                [MESSAGE_TEMPLATE]: true
            })
        }
        else if(outer_container){
            // Click watch credits button
            const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0]
            credits_button.click()
            outer_container.remove() // remove container

            // Stop analyzing
            clearInterval(this.interval)

            // Pause the video
            document.getElementsByTagName("video")[0].pause()

            // Send FINISHED signal to the BackgroundScript
            await chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.FINISHED,
                [MESSAGE_TEMPLATE]: true
            })
        }
    }
}