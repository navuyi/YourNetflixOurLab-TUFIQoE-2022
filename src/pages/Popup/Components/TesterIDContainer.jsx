import React, { useEffect } from "react"
import { useState } from "react"
import { useLayoutEffect } from "react"
import { STORAGE_KEYS } from "../../config"
import TesterID from "./TesterID"

const TesterIDContainer = (props) => {
    const [testerOneID, setTesterOneID] = useState("")
    const [testerTwoID, setTesterTwoID] = useState("")
    const [pairID, setPairID] = useState("")
    
    useLayoutEffect(() => {
        const init = async () => {
            const res = await chrome.storage.local.get([STORAGE_KEYS.TESTER_ONE_ID, STORAGE_KEYS.TESTER_TWO_ID, STORAGE_KEYS.PAIR_ID])
            setTesterOneID(res[STORAGE_KEYS.TESTER_ONE_ID])
            setTesterTwoID(res[STORAGE_KEYS.TESTER_TWO_ID])
            setPairID(res[STORAGE_KEYS.PAIR_ID])
        }

        init()
    }, [])

    useEffect(() => {
        const update = async () => {
            const new_pair_id = testerOneID + testerTwoID
            setPairID(new_pair_id)
            await chrome.storage.local.set({
                [STORAGE_KEYS.PAIR_ID]: new_pair_id
            })
        }

        update()
    }, [testerOneID, testerTwoID])


    return(
        <div style={{width: "100%", marginTop: "30px"}}>
            <TesterID 
                index={1}
                label={"one"}
                id={testerOneID}
                setTesterID={setTesterOneID}
                deviceID={props.deviceID}
            />
            <TesterID 
                index={2}
                label={"two"}
                id={testerTwoID}
                setTesterID={setTesterTwoID}
                deviceID={props.deviceID}
            />
            <div style={{width: "100%", marginBottom: "30px", display:"flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <h3>Pair ID (seed)</h3>
            <input 
                type="text"
                value={pairID}
                readOnly={true}
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
                    border: "none",
                    cursor: "not-allowed",
                    backgroundColor: "#a2a2a2"
                }}
            />
        </div>
        </div>
    )
}



export default TesterIDContainer