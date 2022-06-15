import axios from "axios"
import { STORAGE_KEYS } from "../pages/config"
import { BACKEND_URL, backend_urls } from "./config"

export const create_experiment = async (data) => {
    try{
        const response = await axios.post(backend_urls.experiment, data)
        console.log(response.data)
        console.log(response.status)
        if(response.status === 201){
            console.log("Experiment created")
            const experiment_id = response.data.experiment_id
            await chrome.storage.local.set({
                [STORAGE_KEYS.DATABASE_EXPERIMENT_ID]: experiment_id
            })
        }
    }
    catch(err){
        console.log(err)
    }
}