import React, { useState } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { STORAGE_KEYS } from "../../../../config";



const EpisodesAmount = (props) => {


    useLayoutEffect(() => {
        const init = async () => {
            // Initialize episode amount
            const limit = (await chrome.storage.local.get([STORAGE_KEYS.VIDEO_LIMIT]))[STORAGE_KEYS.VIDEO_LIMIT]
            props.setEpisodesAmount(limit)
        }
        init()
    }, [])


    const handleChange = async (e) => {
        const value = parseInt(e.target.value)
        props.setEpisodesAmount(value)

        await chrome.storage.local.set({
            [STORAGE_KEYS.VIDEO_LIMIT]: value
        })
    }

    const option_style = {
        fontFamily: "Ubuntu, sans-serif",
        fontSize: "16px"
    }


    return (
        <div style={{ width: "100%", marginTop: "30px", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
            <h3>Episodes amount</h3>
            <select
                style={{
                    width: "200px", height: "30px",
                    outline: "none",
                    border: "none", borderRadius: "3px",
                    fontWeight: "bold", fontFamily: "Ubuntu, sans-serif", textAlign: "center"
                }}
                value={props.episodesAmount}
                onChange={handleChange}
            >
                <option style={option_style} value={1} label="One" />
                <option style={option_style} value={2} label="Two" />
                <option style={option_style} value={3} label="Three" />
                <option style={option_style} value={4} label="Four" />
            </select>
        </div>
    )
}

export default EpisodesAmount