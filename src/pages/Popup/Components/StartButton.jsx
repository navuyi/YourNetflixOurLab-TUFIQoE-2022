import React from "react";
import { useState } from "react";
import {STORAGE_KEYS} from "../../config";



const StartButton = (props) => {


    const handleClick = async (e) => {
        const decision = await window.confirm("Make sure all settings are correct!!!")
        const start_url = (await chrome.storage.local.get([STORAGE_KEYS.EPISODES_URL]))[STORAGE_KEYS.EPISODES_URL][0]

        const res = await chrome.storage.local.get([
            STORAGE_KEYS.EPISODES_LIMIT, 
            STORAGE_KEYS.EPISODE_COUNT, 
            STORAGE_KEYS.EPISODES_URL, 
            STORAGE_KEYS.DEVICE_ID,
            STORAGE_KEYS.SESSION_TYPE
        ])
        console.log(res)
        


        if(decision){
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            await chrome.tabs.update(tabs[0].id, {url: start_url})
        }

    }

    return(
        <button id="startButton" onClick={handleClick}> Start </button>
    )
}


export default StartButton