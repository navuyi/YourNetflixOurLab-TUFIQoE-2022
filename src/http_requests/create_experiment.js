import axios from "axios"
import { BACKEND_URL, backend_urls } from "./config"

export const create_experiment = async (data) => {
    try{
        const response = await axios.post(backend_urls.experiment, data)
        console.log(response.data)
        console.log(response.status)
        if(response.status === 201){
            console.log("Experiment created")
        }
    }
    catch(err){
        console.log(err)
    }
}