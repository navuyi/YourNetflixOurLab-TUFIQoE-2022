import React, { useLayoutEffect, useState } from "react";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import Button from "./Button/Button";



const MappingStartButton = () => {
    const [mappingAvailable, setMappingAvailable] = useState(false)

    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            if(settings.urls.length === 0){
                return 
            }
            if(settings.urls.some(url => /https:\/\/www.netflix.com\/watch\//gm.test(url) === false)){
                return
            }



            setMappingAvailable(true)
        }

        init()
    }, [])
   
    const handleMappingStart = async () => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()

        variables.extension_mode = "mapping"
        variables.extension_running = true
        const url = settings.urls[variables.video_index]

        await ChromeStorage.set_experiment_variables(variables)

        window.location.href = url 
    }

    return(
        <Button
            text="Run extension in mapping mode"
            style={{
                backgroundColor: "#00A896",
                marginTop: "1em"
            }}
            attributes={{disabled: !mappingAvailable}}
            handleClick={() => {handleMappingStart()}}
        />
    )
}

export default MappingStartButton