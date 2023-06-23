import React from "react";
import { useSelector } from "react-redux";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import { T_APP_STATE } from "../redux/reducers";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const MappingStartButton = (props : T_PROPS) => {
    const {mapping_applicable, experiment_applicable} = useSelector((state:T_APP_STATE) => state.config)

    const handleMappingStart = async () => {
        if(mapping_applicable === true && experiment_applicable === true){
            const confirmation = window.confirm("Provided config can be used to start experiment. Are you sure you want to run the mapping mode?")
            if(confirmation === false) return;
        }
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()

        variables.extension_mode = "mapping"
        variables.extension_running = true
        const url = settings.config?.videos[variables.video_index].url as string

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
            attributes={{disabled: !mapping_applicable}}
            handleClick={() => {handleMappingStart()}}
        />
    )
}

export default MappingStartButton