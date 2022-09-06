import { get_statistics_element } from "./get_statistics_element"
import { DATABASE_KEYS } from "../../config"
import { CustomLogger } from "../../../utils/CustomLogger"

export class StatisticsMenu{
    constructor(){
        this.stats_element = undefined
        this.logger = new CustomLogger("[StatisticsMenu]")
    }


    /**
     *  Prepares for further actions 
    */
    async init(){
        await this.invoke_statistics_menu()
    }

    /**
     *  Invokes statistics menu to the screen 
     *  and assigns statistics element to the instance's attribute 
    */
    async invoke_statistics_menu(){
        this.stats_element = await get_statistics_element()
    }

    /**
     * Returns statistics element's value parsed to string.
     * It can be further analyzed using regular expressions.
     * @returns {string} 
    */
    get_statistics_text(){
        return this.stats_element.value.toString()
    }

    
    /**
     * Creates object with information retrieved from nerd statistics string value.
     * @returns {object} Object with key - parameter name, values - parameter's value
     * eg. 
     * {    ...
     *      buffering_vmaf: 90,
     *      buffering_bitrate_video: 2550
     *      ...
     * }
    */
    analyze_statistics_text(){
        const text = this.stats_element.value.toString()
        return {
            [DATABASE_KEYS.POSITION]: this.get_value("(Position:) ([0-9]+.[0-9]+)", 2, text),
            [DATABASE_KEYS.VOLUME]: this.get_value("(Volume:) ([0-9]+)%", 2, text),
            [DATABASE_KEYS.SEGMENT_POSITION]: this.get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, text),

            [DATABASE_KEYS.PLAYER_STATE]: this.get_value("(Player state: )([a-zA-Z]+)", 2, text),
            [DATABASE_KEYS.BUFFERING_STATE]: this.get_value("(Buffering state:) (.+)", 2, text),
            [DATABASE_KEYS.RENDERING_STATE]: this.get_value("(Rendering state:) (.+)", 2, text),

            [DATABASE_KEYS.PLAYING_BITRATE_AUDIO]: this.get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, text),
            [DATABASE_KEYS.PLAYING_BITRATE_VIDEO]: this.get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, text),
            [DATABASE_KEYS.RESOLUTION]: this.get_value("([0-9]+x[0-9]+)", 1, text),

            [DATABASE_KEYS.PLAYING_VMAF]: this.get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 1, text),
            [DATABASE_KEYS.BUFFERING_VMAF]: this.get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 2, text),

            [DATABASE_KEYS.BUFFERING_BITRATE_AUDIO]: this.get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, text),
            [DATABASE_KEYS.BUFFERING_BITRATE_VIDEO]: this.get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, text),

            [DATABASE_KEYS.TOTAL_FRAMES]: this.get_value("Total Frames:\\s*([0-9]+)", 1, text),
            [DATABASE_KEYS.TOTAL_DROPPED_FRAMES]: this.get_value("Total Dropped Frames:\\s*([0-9]+)", 1, text),
            [DATABASE_KEYS.TOTAL_CORRUPTED_FRAMES]: this.get_value("Total Corrupted Frames:\\s*([0-9]+)", 1, text),

            [DATABASE_KEYS.FRAMERATE]: this.get_value("Framerate: ([0-9]+.[0-9]+)", 1, text),
            [DATABASE_KEYS.DURATION]: this.get_value("(Duration:) ([0-9]+.[0-9]+)", 2, text)
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
            this.logger.log(e)
            return null
        }
    }
}