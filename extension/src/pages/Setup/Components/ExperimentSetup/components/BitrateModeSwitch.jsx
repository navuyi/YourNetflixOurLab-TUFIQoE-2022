import React from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import { STORAGE_KEYS } from "../../../../config";




const BitrateModeSwitch = (props) => {
    const [mode, setMode] = useState("random")


    useLayoutEffect(() => {
        const init = async () => {
            const mode_from_config = (await chrome.storage.local.get([STORAGE_KEYS.BITRATE_MODE]))[STORAGE_KEYS.BITRATE_MODE]
            setMode(mode_from_config)
        }

        init()
    }, [])

    const option_style = {
        fontFamily: "Ubuntu, sans-serif",
        fontSize: "16px"
    }

    const handleChange = async (e) => {
        // Update state
        const mode = e.target.value
        setMode(mode)

        // Update chrome.storage
        await chrome.storage.local.set({
            [STORAGE_KEYS.BITRATE_MODE]: mode
        })
    }

    return (
        <div style={{ width: "100%", marginTop: "30px", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
            <h3 style={{ color: "#ffffff" }}>Bitrate change mode</h3>
            <select
                style={{
                    width: "200px", height: "30px",
                    outline: "none",
                    border: "none", borderRadius: "3px",
                    fontWeight: "bold", fontFamily: "Ubuntu, sans-serif", textAlign: "center"
                }}
                value={mode}
                onChange={handleChange}
            >
                <option style={option_style} value={"sequential"} label="Sequential" />
                <option style={option_style} value={"random"} label="Random" />
            </select>
        </div>
    )
}


export default BitrateModeSwitch