import {ARCHIVE_KEYS, MESSAGE_TEMPLATE, MESSAGE_HEADERS, STORAGE_KEYS, DATABASE_DEFAULT, ARCHIVE_DEFAULT} from "../../config"
import {get_statistics_element} from "../utils/get_statistics_element";
import { STATS_RECORD_INTERVAL_MS } from "../../config"
import {get_local_datetime} from "../../../utils/time_utils"
import { DATABASE_KEYS } from "../../config"
import {save_json} from "../../../utils/save_json";



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
        this.episodeIndex = (await chrome.storage.local.get([STORAGE_KEYS.EPISODE_COUNT]))[STORAGE_KEYS.EPISODE_COUNT]

        // Get statistics element to be analyzed
        this.element = await get_statistics_element()



        // Start interval that will be killed in case of switching video to another
        this.interval = setInterval(() => {
            chrome.storage.local.get([STORAGE_KEYS.EPISODE_COUNT]).then(async res => {
                const episode_count = res[STORAGE_KEYS.EPISODE_COUNT]
                const episode_index = episode_count - 1
                this.print(`Current episode count: ${episode_count} || Current episode index: ${episode_index}`)

                // Check if script should still be working, if not clear interval and stop sending
                /*
                    if(this.episodeIndex !== currentIndex){
                        //this.print(`Killing interval. Not my session anymore: ${this.episodeIndex} vs ${currentIndex}`)
                        //clearInterval(this.interval)
                        this.print(`Detected change in episode index but taking no action: ${this.episodeIndex} vs ${currentIndex}`)
                        //return
                    }
                */
                

                // Analyze data
                const timestamp = get_local_datetime(new Date())
                const data = await this.analyze_data(this.element.value.toString(), timestamp)
                const archive = this.compile_archive(this.element.value.toString(), timestamp)

                // Save data to local variables - always!!!
                this.save_data_to_local_variable(data, archive)

                // Check if credits are available and remove container
                await this.are_credits_available()
                
                this.record_count += 1

                // Save data to chrome.storage
                if(this.record_count >= 10){
                    await this.save_data_to_storage() 
                    this.record_count = 0
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


    /*
    send_data_to_background(data, archive){
        chrome.runtime.sendMessage({
            [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.NERD_STATISTICS,
            [MESSAGE_TEMPLATE.DATA]: data,
            [MESSAGE_TEMPLATE.ARCHIVE]: archive
        }, res => {
            //console.log(res)
        })
    }
    */
    
    save_data_to_local_variable(data, archive){
        // Save data to local variable
        for(const key in data){
            this.local_database[key].push(data[key])
        }
        for(const key in archive){
            this.local_archive[key].push(archive[key])
        }
    }

    async save_data_to_storage(){
        // Overwrite chrome.storage datasets
        this.print(`Saving data to chrome.storage`)
        const start = new Date()
        await chrome.storage.local.set({
            [STORAGE_KEYS.DATA_TO_SAVE]: this.local_database,
            [STORAGE_KEYS.ARCHIVE_TO_SAVE]: this.local_archive
        })
        console.log(`Elapsed: ${new Date()-start} ms`)
        console.log(this.local_database)
        console.log(this.local_archive)
    }

    insert_blockade(finished = false){
        const blockade = window.document.createElement("div")
        const text = window.document.createElement("h1")
       
        blockade.style.width = "100vw"; blockade.style.height = "100vh";
        blockade.style.top = "0"; blockade. style.left = "0";
        blockade.style.position = "absolute";
        blockade.style.backgroundColor = "black"; blockade.style.opacity = "0.95"
        blockade.style.zIndex = "99999";
        blockade.style.textAlign = "center";
        blockade.style.display = "flex"; blockade.style.justifyContent = "center"; blockade.style.alignItems = "center"


        text.innerText = finished === true ? "Eksperyment zakończony. Proszę zawiadomić administratora eksperymentu. Dziękujemy :)" : "Trwa synchronizacja. Za chwilę przekierowanie do następnego odcinka."




        text.style.color = "whitesmoke"
        text.style.fontSize ="24px"

        blockade.appendChild(text)
        document.body.appendChild(blockade)
    }

    async are_credits_available(){
        const outer_container = document.getElementsByClassName("nfa-pos-abs nfa-bot-6-em nfa-right-5-em nfa-d-flex")[0]

        //data-uia = "watch-credits-seamless-button"
        // data-uia="next-episode-seamless-button"


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

            // Save collected data to chrome.storage || to avoid missing data when video finishes
            await this.save_data_to_storage()

            // Send FINISHED signal to the BackgroundScript
            await chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.FINISHED,
                [MESSAGE_TEMPLATE]: true
            })
        }
    }
}