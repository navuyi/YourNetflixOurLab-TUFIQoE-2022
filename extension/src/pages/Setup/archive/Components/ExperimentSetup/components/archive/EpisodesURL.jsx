import React, { useEffect, useLayoutEffect, useState } from "react";
import { STORAGE_KEYS } from "../../../../../config";


const VideosURL = (props) => {
    const [urlArray, setUrlArray] = useState([""])

    useLayoutEffect(() => {
        async function init() {
            const array = []
            // Populate array
            for (let i = 0; i < props.videosAmount; i++) {
                array.push("")
            }

            const urls = (await chrome.storage.local.get([STORAGE_KEYS.VIDEO_URLS]))[STORAGE_KEYS.VIDEO_URLS]
            for (let i = 0; i < props.videosAmount; i++) {
                array[i] = urls[i] ?? ""
            }

            setUrlArray(array)
            await chrome.storage.local.set({
                [STORAGE_KEYS.VIDEO_URLS]: array
            })
        }

        init()
    }, [props.videosAmount])

    const handleChange = async (e) => {
        const url = e.target.value
        const index = e.target.id
        const tmp = [...urlArray]
        tmp[index] = url

        setUrlArray(tmp)
        await chrome.storage.local.set({
            [STORAGE_KEYS.VIDEO_URLS]: tmp
        })
    }

    return (
        <div style={{ width: "100%", marginTop: "30px", display: "flex", alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" }}>
            <h3>Videos URLs</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {
                    urlArray.map((value, index) => {
                        return <input key={index} id={index} value={value} onChange={handleChange} style={{
                            width: "200px",
                            height: "30px",
                            paddingLeft: "10px",
                            fontFamily: "Ubuntu, sans-serif",
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            outline: "none",
                            boxSizing: "border-box",
                            border: "none",
                            marginBottom: "10px"
                        }} />
                    })

                }
            </div>
        </div>
    )
}



export default VideosURL;