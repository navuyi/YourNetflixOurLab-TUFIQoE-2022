import React from "react";
import { useState } from "react";



const StartButton = (props) => {


    const handleClick = async (e) => {
        const decision = await window.confirm("Make sure all settings are correct!!!")
        const url = "https://developer.chrome.com/docs/extensions/reference/tabs/"
        

        if(decision){
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            const netlix_url = "https://www.netflix.com/pl/"
            await chrome.tabs.update(tabs[0].id, {url: netlix_url})
        }

    }

    return(
        <button id="startButton" onClick={handleClick}> Start </button>
    )
}


export default StartButton