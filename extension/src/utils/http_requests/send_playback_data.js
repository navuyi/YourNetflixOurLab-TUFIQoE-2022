import axios from "axios"
import { STORAGE_KEYS } from "../../pages/config"
import {backend_urls} from "./config"


export const send_playback_data = async (playback_data, archive) => {
    const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATABASE_VIDEO_ID,
        STORAGE_KEYS.CURRENT_BITRATE
    ])


    const data = {
        playback_data: {...playback_data, bitrate: res[STORAGE_KEYS.CURRENT_BITRATE]},
        archive: archive,
        video_id: res[STORAGE_KEYS.DATABASE_VIDEO_ID]
    }
    
    try{
        const response = await axios.post(backend_urls.playback_data, data)
        if(response.status === 201){
            console.log("Playback data submitted successfully")
        }
    }
    catch(err){
        console.log(err)
    }
}

