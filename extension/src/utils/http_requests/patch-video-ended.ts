import axios from "axios"
import { ChromeStorage } from "../custom/ChromeStorage"
import { get_local_datetime } from "../time_utils"
import {  backend_urls } from "./config"


export const patch_video_ended = async (database_video_id : number) : Promise<void> => {
    try{
        const data = {
            ended: get_local_datetime(new Date()),
            video_id: database_video_id 
        }
        const response = await axios.patch(backend_urls.video, data)
        console.log(response.data?.msg)
    }
    catch(err){
        console.log(err)
    }
}