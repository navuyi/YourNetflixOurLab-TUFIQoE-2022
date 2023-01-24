import React from "react";
import { useState } from "react";


const ContinueButton = (props) => {
    const [backgroundColor, setBackgroundColor] = useState("#e50914")
    const [btnVisible, setBtnVisible] = useState(true)

    const style = {
        fontSize: "24px",

        backgroundColor: backgroundColor,
        outline: "none",
        border: "none",
        borderRadius: "5px",
        padding: "15px 100px",
        color: "whitesmoke",
        cursor: "pointer",
        visibility: btnVisible ? "visible" : "hidden",
        pointerEvents: btnVisible ? "auto" : "none"
    }

    const handleClick = async () => {
        console.log("Navigating")
        setBtnVisible(false)
        await chrome.tabs.update(props.navigationInfo.tab_id, {
            url: props.navigationInfo.next_url
        })
    }

    const onEnter = () => {
        setBackgroundColor("#b5020b")
    }

    const onLeave = () => {
        setBackgroundColor("#e50914")
    }

    return(
        <>
            <button 
                style={style}
                onMouseEnter={onEnter} 
                onMouseLeave={onLeave}
                onClick={handleClick}
            > Continue </button> 
        </>
    )
}


export default ContinueButton