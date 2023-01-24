import React from "react";
import ConfigFileInput from "./components/ConfigFileInput/ConfigFileInput";
import ConfigPreview from "./components/ConfigFilePreview/ConfigPreview";
import useJSONConfig from "./hooks/useJSONConfig"

import StartMappingButton from "./components/StartMappingButton/StartMappingButton";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import ConfigFileDownloadButton from "./components/ConfigFileDownloadButton/ConfigFileDownloadButton";
import { Row, Col } from "react-bootstrap";


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
            <ConfigPreview json_string={json_string} json_object={json_object} />
            <Row className="flex-row justify-content-between mt-5">
                <Col><StartMappingButton /></Col>
                <Col><ConfigFileDownloadButton /></Col>
            </Row>
        </>
    )
}



export default ConfigFileMenu