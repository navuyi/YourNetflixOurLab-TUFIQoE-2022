import {ARCHIVE_KEYS, MESSAGE_TEMPLATE, MESSAGE_HEADERS, STORAGE_KEYS, DATABASE_DEFAULT, ARCHIVE_DEFAULT} from "../../config"
import {get_statistics_element} from "../utils/get_statistics_element";
import { STATS_RECORD_INTERVAL_MS } from "../../config"
import {get_local_datetime} from "../../../utils/time_utils"
import { DATABASE_KEYS } from "../../config"
import {send_playback_data} from "../../../http_requests/send_playback_data"


export class StatsAnalyzer{
    constructor(){
        this.element = undefined
        this.interval = undefined
        this.episodeIndex = undefined

        this.local_database = DATABASE_DEFAULT
        this.local_archive = ARCHIVE_DEFAULT
        this.record_count = 0
    }

    print(text){
        console.log(`[StatsAnalyzer] ${text}`)
    }

    async init(){
        this.print(`Initializing...`)

        // Assigning episode index
        this.episodeIndex = (await chrome.storage.local.get([STORAGE_KEYS.VIDEO_COUNT]))[STORAGE_KEYS.VIDEO_COUNT]

        // Get statistics element to be analyzed
        this.element = await get_statistics_element()



        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(() => {
            chrome.storage.local.get([STORAGE_KEYS.VIDEO_COUNT]).then(async res => {
                const video_count = res[STORAGE_KEYS.VIDEO_COUNT]
                const episode_index = video_count - 1
                
                // Analyze data
                const timestamp = get_local_datetime(new Date())
                const data = await this.analyze_data(this.element.value.toString(), timestamp)
                const archive = this.compile_archive(this.element.value.toString(), timestamp)

                // Send playback data to backend
                // Not using await --> not waiting for response
                /*await*/send_playback_data(data, archive)
                

                // Check if credits are available and remove container
                await this.are_credits_available()
            })
        }, STATS_RECORD_INTERVAL_MS)
    }

    /**
     * Utility method creates object with all data to be extracted from nerd stats (long) string
     * @param {string} data 
     * @param {string} timestamp 
     * @returns {object} result
     */
    async analyze_data(data, timestamp){
        const result = {
            [DATABASE_KEYS.POSITION]: this.get_value("(Position:) ([0-9]+.[0-9]+)", 2, data),
            [DATABASE_KEYS.VOLUME]: this.get_value("(Volume:) ([0-9]+)%", 2, data),
            [DATABASE_KEYS.SEGMENT_POSITION]: this.get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, data),

            [DATABASE_KEYS.PLAYER_STATE]: this.get_value("(Player state: )([a-zA-Z]+)", 2, data),
            [DATABASE_KEYS.BUFFERING_STATE]: this.get_value("(Buffering state:) (.+)", 2, data),
            [DATABASE_KEYS.RENDERING_STATE]: this.get_value("(Rendering state:) (.+)", 2, data),

            [DATABASE_KEYS.PLAYING_BITRATE_AUDIO]: this.get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data),
            [DATABASE_KEYS.PLAYING_BITRATE_VIDEO]: this.get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data),
            [DATABASE_KEYS.RESOLUTION]: this.get_value("([0-9]+x[0-9]+)", 1, data),

            [DATABASE_KEYS.PLAYING_VMAF]: this.get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 1, data),
            [DATABASE_KEYS.BUFFERING_VMAF]: this.get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 2, data),

            [DATABASE_KEYS.BUFFERING_BITRATE_AUDIO]: this.get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data),
            [DATABASE_KEYS.BUFFERING_BITRATE_VIDEO]: this.get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data),

            [DATABASE_KEYS.TOTAL_FRAMES]: this.get_value("Total Frames:\\s*([0-9]+)", 1, data),
            [DATABASE_KEYS.TOTAL_DROPPED_FRAMES]: this.get_value("Total Dropped Frames:\\s*([0-9]+)", 1, data),
            [DATABASE_KEYS.TOTAL_CORRUPTED_FRAMES]: this.get_value("Total Corrupted Frames:\\s*([0-9]+)", 1, data),

            [DATABASE_KEYS.FRAMERATE]: this.get_value("Framerate: ([0-9]+.[0-9]+)", 1, data),
            [DATABASE_KEYS.TIMESTAMP]: timestamp,
            [DATABASE_KEYS.DURATION]: this.get_value("(Duration:) ([0-9]+.[0-9]+)", 2, data)
        }
        return result
    }

    compile_archive = (data, timestamp) => {
        return {
            [ARCHIVE_KEYS.DATA]: data,
            [ARCHIVE_KEYS.TIMESTAMP]: timestamp
        }
    }

    /**
     * Utility method --> extracts useful data from nerds stats (long) string
     * @param {string} regex 
     * @param {number} group 
     * @param {string} data 
     * @returns {object|null}
     */
    get_value = (regex, group, data) => {
        try{
            let value = data.match(regex) ?? null
            if(value != null){
                return value[group]
            }
            else{
                return null
            }
        }
        catch(e){
            console.log(e)
            return null
        }
    }


    /**
     * This method checks if certain HTML elements are available in DOM tree.
     * Their availability indicates that serie's video is about to end and credits are present.
     * If elements are detected video playback ends and subject is redirected to custom extension's web page
    */
    async are_credits_available(){
        // Provide emergency check 5-10 seconds before end of the video (duration time) in case detecting credits does not work.
        
        const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]

        //data-uia = "watch-credits-seamless-button"
        // data-uia="next-episode-seamless-button"
        

        // TODO
        // THIS WILL NOT WORK PROPERLY IN THE LAST EPISODE OF THE SERIE
        // FIX, FIND WORKAROUND ! ! !
        
        if(outer_container){
            // Click watch credits button
            const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0]
            console.log(credits_button)
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