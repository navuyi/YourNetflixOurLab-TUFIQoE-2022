import axios from "axios";
import { backend_urls } from "./config";


export const send_bitrate = async (bitrate_data) => {
    try{
        console.log(backend_urls.bitrate)
        const response = await axios.post(backend_urls.bitrate, bitrate_data)
        if(response.status === 201){
            console.log("Bitrate data submitted successfully")
        }
    }
    catch(err){
        console.log(err)
    }
}