import { T_DEBUG_DATA_PROCESSED } from "../config/types/data-structures.type"

/**
 * Utility method --> extracts useful data from nerds stats (long) string
 * @param {string} regex 
 * @param {number} group 
 * @param {string} data 
 * @returns {object|null}
*/
const get_value = (regex:string, group:number, data:string) => {
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
        return null
    }
}

export const extract_debug_menu_data = (debug_menu_text : string, timestamp : string) : T_DEBUG_DATA_PROCESSED => {
    const data : T_DEBUG_DATA_PROCESSED =  {
        position: extract_position(debug_menu_text),
        volume: extract_volume(debug_menu_text),
        segment_position: extract_segment_position(debug_menu_text),

        player_state: extract_player_state(debug_menu_text),
        buffering_state: extract_buffering_state(debug_menu_text),
        rendering_state: extract_rendering_state(debug_menu_text),

        playing_bitrate_audio: extract_playing_bitrate_audio(debug_menu_text),
        playing_bitrate_video: extract_playing_bitrate_video(debug_menu_text),
        resolution: extract_resolution(debug_menu_text),

        playing_vmaf: extract_playing_vmaf(debug_menu_text),
        buffering_vmaf: extract_buffering_vmaf(debug_menu_text),

        buffering_bitrate_audio: extract_buffering_bitrate_audio(debug_menu_text),
        buffering_bitrate_video: extract_buffering_bitrate_video(debug_menu_text),

        total_frames: extract_total_frames(debug_menu_text),
        total_dropped_frames: extract_total_dropped_frames(debug_menu_text),
        total_corrupted_frames: extract_total_corrupted_frames(debug_menu_text),

        framerate: extract_framerate(debug_menu_text),
        duration: extract_duration(debug_menu_text),
        timestamp: timestamp
    }
    
    return data
}



export const extract_position = (data : string) => {
   return get_value("(Position:) ([0-9]+.[0-9]+)", 2, data)
}
export const extract_volume = (data : string) => {
    return get_value("(Volume:) ([0-9]+)%", 2, data)
}
export const extract_segment_position = (data : string) => {
    return get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, data)
}
export const extract_player_state = (data : string) => {
    return get_value("(Player state: )([a-zA-Z]+)", 2, data)
}
export const extract_buffering_state = (data : string) => {
    return get_value("(Buffering state:) (.+)", 2, data)
}
export const extract_rendering_state = (data : string) => {
    return get_value("(Rendering state:) (.+)", 2, data)
}
export const extract_playing_bitrate_audio = (data : string) => {
    return get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data)
}
export const extract_playing_bitrate_video = (data : string) => {
    return get_value("Playing bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data)
}
export const extract_resolution = (data : string) => {
    return get_value("([0-9]+x[0-9]+)", 1, data)
}
export const extract_playing_vmaf = (data : string) => {
    return get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 1, data)
}
export const extract_buffering_vmaf = (data : string) => {
    return get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 2, data)
}
export const extract_buffering_bitrate_audio = (data : string) => {
    return get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 1, data)
}
export const extract_buffering_bitrate_video = (data : string) => {
    return get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data)
}
export const extract_total_frames = (data : string) => {
    return get_value("Total Frames:\\s*([0-9]+)", 1, data)
}
export const extract_total_dropped_frames = (data : string) => {
    return get_value("Total Dropped Frames:\\s*([0-9]+)", 1, data)
}
export const extract_total_corrupted_frames = (data : string) => {
    return get_value("Total Corrupted Frames:\\s*([0-9]+)", 1, data)
}
export const extract_framerate = (data : string) => {
    return get_value("Framerate: ([0-9]+.[0-9]+)", 1, data)
}
export const extract_duration = (data : string) => {
    return get_value("(Duration:) ([0-9]+.[0-9]+)", 2, data)
}