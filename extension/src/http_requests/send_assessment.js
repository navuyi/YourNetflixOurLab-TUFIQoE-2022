import axios from "axios";
import { backend_urls } from "./config";


export const send_assessment = async (assessment_data) => {
    try{
        const response = await axios.post(backend_urls.assessment, assessment_data)
        if(response.status === 201){
            console.log("Assessment data submitted successfully")
        }
    }
    catch(err){
        console.log(err)
    }
}