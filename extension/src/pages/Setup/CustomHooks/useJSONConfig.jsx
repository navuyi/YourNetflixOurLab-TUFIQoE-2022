import { useState } from "react"

const useJSONConfig = () => {

    const [json_string, set_json_string] = useState("")
    const [json_object, set_json_object] = useState({})

    //TODO Think on this and change names so they match or sth idk

    /**
     * Handles changes inside textarea  
    */
    const handle_preview_change = (e) => {
        set_json_string(e.target.value)
    }

    /**
     * Handles json file input and updates state
     * Uses the FileReader instance 
    */
    const read_data_from_file = (e) => {
        file_reader.readAsText(e.target.files[0])
    }


    const file_reader = new FileReader()
    file_reader.onload = (e) => {
        const data = e.target.result
        set_json_string(data)
        set_json_object(JSON.parse(data))
    }



    return {
        json_string,
        json_object,
        handle_preview_change,
        read_data_from_file
    }
}



export default useJSONConfig