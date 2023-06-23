import axios from "axios"
import {  backend_urls } from "./config"

type T_DATA = {
    started: string,
    experiment_id: number,
    url: string
}

export const post_new_video = async (data:T_DATA) : Promise<number | undefined> => {
    try{
        const response = await axios.post(backend_urls.video, data)
        return response.data.video_id
    }catch(err){
        console.log(err)
    }
}
