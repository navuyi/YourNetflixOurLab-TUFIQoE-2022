import React from "react";
import styles from "./style.module.css"
import useStartMappingButton from "./hooks/useStartMappingButton";
import { Button } from "react-bootstrap"

const StartMappingButton = (props) => {

    const { handleClick } = useStartMappingButton()

    return (
        <>
            <Button variant="danger" onClick={handleClick} className={"w-100"} > Start VMAF--Bitrate mapping</Button>
        </>
    )
}




export default StartMappingButton