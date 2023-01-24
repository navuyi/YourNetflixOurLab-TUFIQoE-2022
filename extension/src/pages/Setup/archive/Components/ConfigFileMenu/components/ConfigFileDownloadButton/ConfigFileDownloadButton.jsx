import React from "react";
import { Button } from "react-bootstrap"
import useSaveConfigurationFileButton from "./hooks/useSaveConfigurationFileButton";



const ConfigFileDownloadButton = (props) => {


    const { handleClick } = useSaveConfigurationFileButton()

    return (
        <>
            <Button variant="secondary" className={"w-100"} onClick={handleClick}>Download config file</Button>
        </>
    )
}

export default ConfigFileDownloadButton