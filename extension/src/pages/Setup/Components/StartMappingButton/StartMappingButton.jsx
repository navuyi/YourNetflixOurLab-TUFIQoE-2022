import React from "react";
import styles from "./style.module.css"
import useStartMappingButton from "./hooks/useStartMappingButton";

const StartMappingButton = (props) => {

    const { handleClick } = useStartMappingButton()

    return (
        <>
            <button onClick={handleClick} className={styles.start_mapping_btn} > Start VMAF--Bitrate mapping</button>
        </>
    )
}




export default StartMappingButton