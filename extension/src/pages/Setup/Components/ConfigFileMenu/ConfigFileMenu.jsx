import React from "react";
import ConfigFileInput from "../ConfigFileInput/ConfigFileInput";
import ConfigPreview from "../ConfigFilePreview/ConfigPreview";
import useJSONConfig from "../../CustomHooks/useJSONConfig";

import StartMappingButton from "../StartMappingButton/StartMappingButton";
import { useLayoutEffect } from "react";
import { useEffect } from "react";


const ConfigFileMenu = (props) => {

    const { json_string, json_object, read_data_from_file, read_config_from_chrome_storage } = useJSONConfig()

    useEffect(() => {
        const init = async () => {
            await read_config_from_chrome_storage()
        }


        init()
    }, [])

    return (
        <>
            <ConfigFileInput read_data_from_file={read_data_from_file} />
            <br></br><br></br><br></br>

            <ConfigPreview json_string={json_string} json_object={json_object} />

            <StartMappingButton />
        </>
    )
}



export default ConfigFileMenu