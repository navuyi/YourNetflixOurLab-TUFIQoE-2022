import React, { useLayoutEffect, useState } from "react";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import Button from "./Button/Button";
import { useSelector } from "react-redux";
import { T_APP_STATE } from "../redux/reducers";


const MappingStartButton = () => {
    const setup = useSelector((state:T_APP_STATE) => state.setup)
    console.log(setup)
    
   
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
            attributes={{disabled: !setup.mappingAvailable }}
            handleClick={() => {handleMappingStart()}}
        />
    )
}

export default MappingStartButton