import axios from "axios"
import {  backend_urls } from "./config"


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