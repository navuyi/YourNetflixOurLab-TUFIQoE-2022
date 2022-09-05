import axios from "axios"
import { STORAGE_KEYS } from "../../pages/config"
import {  backend_urls } from "./config"
import {get_local_datetime} from "../time_utils"

export const create_video = async (data) => {
    try{
        const response = await axios.post(backend_urls.video, data)
        console.log(response.data)
        console.log(response.status)
        if(response.status === 201){
            console.log("Video created")
            const video_id = response.data.video_id
            await chrome.storage.local.set({
                [STORAGE_KEYS.DATABASE_VIDEO_ID]: video_id
            })

            console.log(await chrome.storage.local.get([STORAGE_KEYS.DATABASE_EXPERIMENT_ID, STORAGE_KEYS.DATABASE_VIDEO_ID]))
        }
    }
    catch(err){
        console.log(err)
    }
}