import React, { useLayoutEffect } from "react"
import style from "./style.module.scss"
import { useState } from "react"

const ConfigDetected = () => {
    const [status, setStatus] = useState<boolean>(false)

    useLayoutEffect(() => {
        const init = async () => {
            // check if config is complete or not
        }

        init()
    })


    return(
        <div className={style.config_detected}>
            Config detected
            <div>
                <span className={style.header}></span>
            </div>
        </div>
    )
}

export default ConfigDetected