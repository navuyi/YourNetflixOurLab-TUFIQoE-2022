import axios from "axios"
import { backend_urls } from "./config"

type T_INPUT_DATA = {
    started : string,
    subject_id : string | number,
    settings : string,
    urls : string
}

export const post_new_experiment = async (data : T_INPUT_DATA) : Promise<number|undefined> => {
    try{
        const response = await axios.post(backend_urls.experiment, data)
        return response.data.experiment_id
    }catch(err : any){
        if (err.response) {
            // The client was given an error response (5xx, 4xx)
        } else if (err.request) {
            // The client never received a response, and the request was never left
        } else {
            // Anything else
        }
    }
}



