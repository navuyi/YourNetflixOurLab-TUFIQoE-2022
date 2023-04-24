import React from "react"
import Button from "./Button/Button"
import { ChromeStorage } from "../../../utils/custom/ChromeStorage"
import { useSetup } from "../hooks/useSetup"

const VideosEraseButton = () => {
    const {validateExperimentAvailable} = useSetup()

    const handleErase = async () => {
        await ChromeStorage.update_experiment_settings_property("videos", [])
        const settings = await ChromeStorage.get_experiment_settings()
        validateExperimentAvailable(settings)
    }

    return(
        <Button text='Erase' handleClick={handleErase} style={{backgroundColor: "#A4243B", padding: "5px 10px", width: "auto", marginTop: "5px"}}/>
    )
}


export default VideosEraseButton