import React from "react";


const EmergencySaveButton = (props) => {


    const style = {
        width: "100%",
        height: "40px",

        fontSize: "18px",
        color: "white",

        outline: "none",
        border: "none",
        borderRadius: "3px",
        backgroundColor: "#E50914",
        cursor: "pointer",
        marginTop: "50px",
        marginBottom: "20px"
    }

    const handleClick = () => {
        chrome.runtime.sendMessage({
            header: "SAVE_DATA",
            payload: true
        })
    }

    return(
        <button style={style} onClick={handleClick}>Save all collected data</button>
    )
}



export default EmergencySaveButton