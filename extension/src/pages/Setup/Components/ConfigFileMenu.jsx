import React from "react";
import ConfigFileInput from "./ConfigFileInput";
import ConfigPreview from "./ConfigPreview";
import useJSONConfig from "../CustomHooks/useJSONConfig";

const ConfigFileMenu = (props) => {

    const { json_string, json_object, handle_preview_change, read_data_from_file } = useJSONConfig()

    return (
        <>
            <ConfigFileInput read_data_from_file={read_data_from_file} />
            <br></br><br></br><br></br>

            <ConfigPreview json_string={json_string} handle_preview_change={handle_preview_change} />
        </>
    )
}



export default ConfigFileMenu