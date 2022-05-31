import React from "react"
import {useState} from "react";
import {useLayoutEffect} from "react";
import {STORAGE_KEYS} from "../../config";


const SessionType = () => {
    const [session, setSession] = useState("together")


    useLayoutEffect(() => {
        const init = async () => {
            const res = await chrome.storage.local.get([STORAGE_KEYS.EXPERIMENT_TYPE])
            setSession(res[STORAGE_KEYS.EXPERIMENT_TYPE])
        }

        init()
    }, [])

    const handleClick = async (e) => {
        const ses = e.target.getAttribute("session")
        setSession(ses)
        await chrome.storage.local.set({
            [STORAGE_KEYS.EXPERIMENT_TYPE]: ses
        })
    }

    const button_1_style = {
        width: "200px",
        height: "30px",

        fontSize: "18px",
        color: session === "alone" ? "#ffffff" : "#222222",

        outline: "none",
        border: "none",
        borderRadius: "3px",
        backgroundColor: session === "alone" ? "#E50914" : "#ffffff",
        cursor: "pointer"
    }
    const button_2_style = {
        width: "200px",
        height: "30px",
        fontSize: "18px",
        color: session === "together" ? "#ffffff" : "#222222",
        outline: "none",
        border: "none",
        borderRadius: "3px",
        backgroundColor: session === "together" ? "#E50914" : "#ffffff",
        cursor: "pointer"
    }

    return(
        <div style={{width: "100%", marginTop: "0px"}}>
            <h3>Session type</h3>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: "10px"}}>
                <button onClick={handleClick} style={button_1_style} session={"alone"}>Alone</button>
                <button onClick={handleClick} style={button_2_style} session={"together"}>Together</button>
            </div>
        </div>
    )
}


export default SessionType