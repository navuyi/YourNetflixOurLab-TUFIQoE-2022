import React from "react";
import { useState } from "react";
import { test_chrome_storage } from "../../../../test/test_chrome_storage";
import {STORAGE_KEYS} from "../../config";
import axios from "axios";
import { create_experiment } from "../../../http_requests/create_experiment";
import { get_local_datetime } from "../../../utils/time_utils";


const StartButton = (props) => {


    const handleClick = async (e) => {
        
        const decision = await window.confirm("Make sure all settings are correct!!!")
        const start_url = (await chrome.storage.local.get([STORAGE_KEYS.VIDEO_URLS]))[STORAGE_KEYS.VIDEO_URLS][0]

        const res = await chrome.storage.local.get([
            STORAGE_KEYS.VIDEO_LIMIT, 
            STORAGE_KEYS.VIDEO_COUNT, 
            STORAGE_KEYS.VIDEO_URLS, 
            STORAGE_KEYS.DEVICE_ID,
            STORAGE_KEYS.EXPERIMENT_TYPE,
            STORAGE_KEYS.TESTER_ID
        ])

        const data = {
            started: get_local_datetime(new Date()),
            device_id: res[STORAGE_KEYS.DEVICE_ID],
            experiment_type: res[STORAGE_KEYS.EXPERIMENT_TYPE],
            video_limit: res[STORAGE_KEYS.VIDEO_LIMIT],
            tester_id: res[STORAGE_KEYS.TESTER_ID],
            urls: res[STORAGE_KEYS.VIDEO_URLS]
        }

        
        


        if(decision){
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            // Post data to the backend
            await create_experiment(data)
            // Redirect to the first video
            await chrome.tabs.update(tabs[0].id, {url: start_url})
        }

    }

    return(
        <button id="startButton" onClick={handleClick}> Start </button>
    )
}


export default StartButton