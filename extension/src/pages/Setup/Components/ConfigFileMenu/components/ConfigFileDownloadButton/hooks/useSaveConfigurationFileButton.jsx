import React from "react";
import { save_json } from "../../../../../../../utils/save_json";
import { STORAGE_KEYS } from "../../../../../../config";

const useSaveConfigurationFileButton = () => {

    const handleClick = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        save_json(configuration, "configuration_file.json")
    }








    return {
        handleClick
    }
}


export default useSaveConfigurationFileButton



