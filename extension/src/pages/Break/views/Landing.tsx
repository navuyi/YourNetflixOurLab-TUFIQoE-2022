import React from "react";
import { useNavigate } from "react-router";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import { useLayoutEffect } from "react";

const Landing = () => {
    const navigate = useNavigate()

    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            const variables = await ChromeStorage.get_experiment_variables()

            if(variables.video_index < settings.videos.length!){
                navigate("break")
            }
            else{
                navigate("finished")
            }
        }

        init()
    }, [])
    
    const style = {
        width: "100%",
        height: "100%",
        backgroundColor: "#222222"
    }

    return(
        <div className="landing" style={style}>

        </div>
    )
}


export default Landing