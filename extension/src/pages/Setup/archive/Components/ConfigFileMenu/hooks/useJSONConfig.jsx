import { useState } from "react"
import { STORAGE_KEYS } from "../../../../config"

const useJSONConfig = () => {

    const [json_string, set_json_string] = useState("")
    const [json_object, set_json_object] = useState({})


    /**
     * Handles json file input and updates state
     * Uses the FileReader instance 
    */
    const read_data_from_file = (e) => {
        file_reader.readAsText(e.target.files[0])
    }

    const file_reader = new FileReader()
    file_reader.onload = async (e) => {
        const string = e.target.result
        const obj = JSON.parse(string)
        // Update state (view)
        set_json_string(string)
        set_json_object(obj)
        // Update chrome storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.CONFIGURATION]: obj
        })
        await update_video_limit(obj.videos.length)
    }



    const read_config_from_chrome_storage = async () => {
        // Read saved configuration from chrome storage
        const res = await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION])
        const configuration = res[STORAGE_KEYS.CONFIGURATION]
        console.log(configuration)
        // Update state (view)
        set_json_string(JSON.stringify(configuration))
        set_json_object(configuration)

        // Update storage
        await update_video_limit(configuration.videos.length)
    }

    const update_video_limit = async (limit) => {
        await chrome.storage.local.set({
            [STORAGE_KEYS.VIDEO_LIMIT]: limit
        })
    }

    return {
        json_string,
        json_object,
        read_data_from_file,
        read_config_from_chrome_storage
    }
}



export default useJSONConfig