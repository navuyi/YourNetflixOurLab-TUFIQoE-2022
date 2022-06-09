import axios from "axios"
import { STORAGE_KEYS } from "../pages/config"
import { BACKEND_URL, backend_urls } from "./config"
import { get_local_datetime } from "../utils/time_utils"

export const update_video = async (data) => {
    try{
        const response = await axios.patch(backend_urls.video, data)
        console.log(response.data)
        console.log(response.status)
        if(response.status === 201){
            console.log("Video updated")
        }
    }
    catch(err){
        console.log(err)
    }
}