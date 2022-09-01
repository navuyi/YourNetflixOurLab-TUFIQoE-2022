import React, { useEffect } from "react"
import { useState } from "react"
import { useLayoutEffect } from "react"
import { STORAGE_KEYS } from "../../config"
import TesterID from "./TesterID"

const TesterIDContainer = (props) => {
    const [testerID, setTesterID] = useState("")
    const [pairID, setPairID] = useState("")

    useLayoutEffect(() => {
        const init = async () => {
            const res = await chrome.storage.local.get([STORAGE_KEYS.TESTER_ID])
            setTesterID(res[STORAGE_KEYS.TESTER_ID])
        }

        init()
    }, [])




    return (
        <div style={{ width: "100%", marginTop: "30px", display: "flex", alignItems: "flex-start", flexDirecion: "row", justifyContent: "space-between" }}>
            <TesterID
                index={1}
                label={"one"}
                id={testerID}
                setTesterID={setTesterID}
                deviceID={props.deviceID}
            />
        </div>
    )
}



export default TesterIDContainer