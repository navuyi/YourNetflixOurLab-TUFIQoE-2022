import axios from "axios"
import { STORAGE_KEYS } from "../pages/config"
import { BACKEND_URL, backend_urls } from "./config"
import { get_local_datetime } from "../utils/time_utils"




export const send_playback_data = async (playback_data) => {
    const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATABASE_VIDEO_ID,
        STORAGE_KEYS.CURRENT_BITRATE
    ])

    // Update playback data with more info
    playback_data.video_id = res[STORAGE_KEYS.DATABASE_VIDEO_ID]    // Current video ID (relational database)
    playback_data.bitrate = res[STORAGE_KEYS.CURRENT_BITRATE]       // Current bitrate set in bitrate menu

    try{
        const response = await axios.post(backend_urls.playback_data, playback_data)
        if(response.status === 201){
            console.log("Playback data submitted successfully")
        }
    }
    catch(err){
        console.log(err)
    }
}