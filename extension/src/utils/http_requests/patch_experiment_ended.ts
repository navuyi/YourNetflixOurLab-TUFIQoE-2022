import axios from "axios"
import { get_local_datetime } from "../time_utils"
import {  backend_urls } from "./config"


export const patch_experiment_ended = async (database_experiment_id : number) : Promise<void> => {
    try{
        const data = {
            ended: get_local_datetime(new Date()),
            experiment_id: database_experiment_id 
        }
        const response = await axios.patch(backend_urls.experiment, data)
        console.log(response.data?.msg)
    }
    catch(err){
        console.log(err)
    }
}