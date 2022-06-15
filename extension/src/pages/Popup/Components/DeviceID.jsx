import React, {useLayoutEffect} from "react";
import {useState} from "react";
import {useEffect} from "react";
import {STORAGE_KEYS} from "../../config";


const DeviceID = (props) => {


    useLayoutEffect(() => {
        const init = async () => {
            const res = await chrome.storage.local.get([STORAGE_KEYS.DEVICE_ID])
            props.setDeviceID(res[STORAGE_KEYS.DEVICE_ID])
        }

        init()
    }, [])

    const handleClick = async (e) => {
        const device_id = parseInt(e.target.getAttribute("device_id"))
        props.setDeviceID(device_id)
        await chrome.storage.local.set({
            [STORAGE_KEYS.DEVICE_ID]: device_id
        })
        console.log(device_id)
    }




    const button_1_style = {
        width: "100px",
        height: "30px",

        fontSize: "18px",
        color: props.deviceID === 106 ? "#ffffff" : "#222222",

        outline: "none",
        border: "none",
        borderRadius: "3px",
        backgroundColor: props.deviceID === 106 ? "#E50914" : "#ffffff",
        cursor: "pointer"
    }
    const button_2_style = {
        width: "100px",
        height: "30px",
        fontSize: "18px",
        color: props.deviceID === 107 ? "#ffffff" : "#222222",
        outline: "none",
        border: "none",
        borderRadius: "3px",
        backgroundColor: props.deviceID === 107 ? "#E50914" : "#ffffff",
        cursor: "pointer"
    }

    return(
        <div style={{width: "100%"}}>
            <h3>Device ID</h3>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "50%", marginTop: "10px"}}>
                <button onClick={handleClick} device_id={106} style={button_1_style}>106</button>
                <button onClick={handleClick} device_id={107} style={button_2_style}>107</button>
            </div>
        </div>

    )
}



export default DeviceID