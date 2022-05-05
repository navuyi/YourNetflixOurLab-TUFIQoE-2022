import {ARCHIVE_KEYS, MESSAGE_TEMPLATE, MESSAGE_HEADERS, STORAGE_KEYS} from "../../config"
import { get_statistics_element } from "./get_statistics_element"
import { STATS_RECORD_INTERVAL_MS } from "../../config"
import {get_local_datetime} from "../../../utils/time_utils"
import { DATABASE_KEYS } from "../../config"


export class StatsAnalyzer{
    constructor(){
        this.element = undefined
        this.interval = undefined
        this.episodeIndex = undefined
    }

    print(text){
        console.log(`[StatsRecorder] ${text}`)
    }

    async init(){
        this.print(`Initializing...`)

        // Assigning episode index
        this.episodeIndex = (await chrome.storage.local.get([STORAGE_KEYS.EPISODE_COUNT]))[STORAGE_KEYS.EPISODE_COUNT]

        // Get statistics element to be analyzed
        this.element = await get_statistics_element()



        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(() => {
            chrome.storage.local.get([STORAGE_KEYS.EPISODE_COUNT]).then(async res => {
                const currentIndex = res[STORAGE_KEYS.EPISODE_COUNT]
                this.print(`${this.episodeIndex} vs ${currentIndex}`)

                // Check if script should still be working, if not clear interval and stop sending
                if(this.episodeIndex !== currentIndex){
                    this.print(`Killing interval. Not my session anymore: ${this.episodeIndex} vs ${currentIndex}`)
                    clearInterval(this.interval)
                    return
                }

                // Analyze data
                const timestamp = get_local_datetime(new Date())
                const data = await this.analyze_data(this.element.value.toString(), timestamp)
                const archive = this.compile_archive(this.element.value.toString(), timestamp)

                // Check if credits are available and remove container
                this.are_credits_available()

                // Check if video has ended, if not send data to background script
                console.log(`duration ${data["duration"]} ___ position ${data["position"]}`)
                if(parseInt(data["position"]) >= parseInt(data["duration"])-10){
                    this.print("Finished")
                    chrome.runtime.sendMessage({
                        [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.FINISH_ANALYZING,
                        [MESSAGE_TEMPLATE.DATA]: true
                    })
                    clearInterval(this.interval)
                    return
                }
                else{
                    // Send data to background
                    this.send_data_to_background(data, archive)
                }
            })
        }, STATS_RECORD_INTERVAL_MS)
    }


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

    send_data_to_background(data, archive){
        chrome.runtime.sendMessage({
            [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.NERD_STATISTICS,
            [MESSAGE_TEMPLATE.DATA]: data,
            [MESSAGE_TEMPLATE.ARCHIVE]: archive
        }, res => {
            console.log(res)
        })
    }


    are_credits_available(){
        const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]

        //data-uia = "watch-credits-seamless-button"
        // data-uia="next-episode-seamless-button"

        // Remove "see credits"/"next episode" buttons
        if(outer_container){
            const credits_button = document.querySelectorAll('[data-uia="watch-credits-seamless-button"]')[0]
            console.log(credits_button)
            credits_button.click()
            outer_container.remove() // remove container
        }
    }
}