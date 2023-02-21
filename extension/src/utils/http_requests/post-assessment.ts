import axios from "axios";
import { backend_urls } from "./config";


export const post_assessment = async (data : object) => {
    try{
        const response = await axios.post(backend_urls.assessment, data)
        if(response.status === 201){
            console.log("Assessment data submitted successfully")
        }
    }
    catch(err){
        console.log(err)
    }
}