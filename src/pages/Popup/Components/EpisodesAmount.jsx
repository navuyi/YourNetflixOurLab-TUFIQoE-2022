import React, { useState } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { STORAGE_KEYS } from "../../Background/config";



const EpisodesAmount = () => {
    const [amount, setAmount] = useState(1)

    useLayoutEffect(() => {
        const init = async () => {
            const amnt = await chrome.storage.local.get([STORAGE_KEYS.EPISODES_AMOUNT])
            setAmount(amnt[STORAGE_KEYS])

            console.log(await chrome.storage.local.get([STORAGE_KEYS.DEVICE_ID, STORAGE_KEYS.EPISODES_AMOUNT, STORAGE_KEYS.SESSION_TYPE]))
        }

        init()
    }, [])


    const handleChange = async (e) => {
        const value = e.target.value
        console.log(value)
        setAmount(value)

        await chrome.storage.local.set({
            [STORAGE_KEYS.EPISODES_AMOUNT]: value
        })
    }

    const option_style = {
        fontFamily: "Ubuntu, sans-serif",
        fontSize: "16px"
    }


    return(
        <div style={{width: "100%", marginTop: "20px", display:"flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
            <h3>Episodes amount</h3>
            <select
                style={{width: "200px", height: "30px", 
                outline: "none", 
                border: "none", borderRadius: "3px", 
                fontWeight: "bold", fontFamily: "Ubuntu, sans-serif", textAlign: "center"}}

                onChange={handleChange}
            >
                <option style={option_style} value={1} label="One" />
                <option style={option_style} value={2} label="Two" />
            </select>
        </div>
    )
}

export default EpisodesAmount