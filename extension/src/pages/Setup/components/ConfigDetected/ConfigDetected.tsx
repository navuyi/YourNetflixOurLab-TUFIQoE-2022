import React, { useEffect, useLayoutEffect } from "react"
import style from "./style.module.scss"
import { useState } from "react"

import trash from "../../../../assets/icons/trash.png"
import { useSelector } from "react-redux"
import { T_APP_STATE } from "../../redux/reducers"
import { useDispatch } from "react-redux"
import { Dispatch } from "redux"
import { T_CONFIG_ACTIONS } from "../../redux/actions/configActions"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { useConfig } from "../../hooks/useConfig"
import { valueToNode } from "@babel/types"

const ConfigDetected = () => {
    const [status, setStatus] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [_style, _setStyle] = useState<object>({})
    const {mapping_applicable, experiment_applicable, value:config} = useSelector((state:T_APP_STATE) => state.config)
    const configDispatch = useDispatch<Dispatch<T_CONFIG_ACTIONS>>()
  
    useEffect(() => {
        if(mapping_applicable === true && experiment_applicable === true){
            setStatus("complete")
            setDescription("Correct and complete config detected. Experiment may be started now.")
            _setStyle({
                color: "#DB0000"
            })
        }
        else if(mapping_applicable === true && experiment_applicable === false){
            setStatus("incomplete")
            setDescription("Start extension in mapping mode or load complete config in order to start the experiment")
            _setStyle({
                color: "#00A896"
            })
        }
        else{
            setStatus("incorrect")
            setDescription("Detected config is incorrect. Some of the essential keys might be missing.")
            _setStyle({
                color: "gold"
            })
        }
    }, [mapping_applicable, experiment_applicable])

    useLayoutEffect(() => {
        const init = async () => {
            // check if config is complete or not
        }

        init()
    })

    const handleConfigErase = async () : Promise<void> => {
        // Erase from chrome storage
        const settings = await ChromeStorage.get_experiment_settings()
        settings.config = null
        await ChromeStorage.set_experiment_settings(settings)

        // Erase from state
        configDispatch({type: "SET_VALUE", payload: null})
        configDispatch({type: "SET_EXPERIMENT_APPLICABLE", payload: false})
        configDispatch({type: "SET_MAPPING_APPLICABLE", payload: false})
    }

    return(
        <div className={style.config_detected}>
            <div className={style.header_wrapper}>
                <span className={style.header}>Config detected</span>
                <img className={style.trash} src={trash} alt="" onClick={handleConfigErase}/>
            </div>
            <span className={style.status}>Status <span className={style.status_detail} style={_style}>{status}</span></span>
            <span className={style.description}>{description}</span>
            <div className={style.url_list}>
                {
                    config?.videos.map((video, index) => {
                        return(
                            <input key={index} className={style.url_item} value={video.url} disabled/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ConfigDetected