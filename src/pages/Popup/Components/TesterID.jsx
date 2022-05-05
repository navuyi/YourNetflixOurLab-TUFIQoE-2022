import React from "react"
import { useState } from "react"
import { useLayoutEffect } from "react"
import { STORAGE_KEYS } from "../../config"


const TesterID = (props) => {
    
    const key = STORAGE_KEYS.TESTER_ID

    const handleChange = async (e) => {
        const value = e.target.value
        props.setTesterID(value)

        await chrome.storage.local.set({
            [key]: value
        })
    }

    return(
        <div style={{width: "100%", marginBottom: "30px", display:"flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <h3 style={{color: props.deviceID === props.index ? "#E50914" : "#ffffff"}}>Tester ID</h3>
            <input 
                type="text"
                value={props.id}
                onChange={handleChange}
                style={{
                    width: "200px",
                    height: "30px",
                    paddingLeft: "10px",
                    fontFamily: "Ubuntu, sans-serif",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    outline: "none",
                    boxSizing: "border-box",
                    border: "none"
                }}
            />
        </div>
    )
}

export default TesterID