import React from "react";
import styles from "./style.module.css"
import useStartMappingButton from "./hooks/useStartMappingButton";
import { Button } from "react-bootstrap"

const StartMappingButton = (props) => {

    const { handleClick } = useStartMappingButton()

    return (
        <>
            <Button variant="danger" onClick={handleClick} className={"mt-5 w-50"} > Start VMAF--Bitrate mapping</Button>
        </>
    )
}




export default StartMappingButton