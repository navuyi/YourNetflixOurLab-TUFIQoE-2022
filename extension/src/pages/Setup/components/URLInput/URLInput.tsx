import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from "react"
import { Dispatch } from "redux"
import style from "./style.module.scss"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { MouseEvent } from "react"
import { useSelector } from "react-redux"
import { T_APP_STATE } from "../../redux/reducers"
import { useDispatch } from "react-redux"
import { T_SETUP_ACTIONS } from "../../redux/actions/setupActions"
import { useSetup } from "../../hooks/useSetup"

type T_PROPS = {
    attributes: object
}

const URLInput = (props:T_PROPS) => {
    const setup = useSelector((state:T_APP_STATE) => state.setup)
    const setupDispatch = useDispatch<Dispatch<T_SETUP_ACTIONS>>()
    const {validateMappingAvailable} = useSetup()

    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            setupDispatch({
                type: "SET_SETUP", key: "urls", payload: settings.urls
            })
        }

        init()
    }, [])

    useEffect(() => {
        const updateStorage = async () => {
            await ChromeStorage.update_experiment_settings_property("urls", setup.urls)
        }
        updateStorage()
        validateMappingAvailable(setup.urls)
    }, [setup.urls])

    
    const handleChange = (e:ChangeEvent<HTMLInputElement>, index:number) => {
        const tmp = [...setup.urls]
        tmp[index] = e.currentTarget.value
        setupDispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }
    const handleDeleteUrl = (e:MouseEvent<HTMLDivElement>, index: number) => {
        const tmp = [...setup.urls]
        tmp.splice(index, 1)
        setupDispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }
    const handleAddUrl = () => {
        const tmp = [...setup.urls]
        tmp.push("")
        setupDispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }

    return(
        <div className={style.urlInput} {...props.attributes}>
            {
                setup.urls.map((url, index) => {
                    return (
                        <div className={style.urlWrapper} key={index}>
                            <input className={style.url} value={url} onChange={e => handleChange(e, index)} />
                            <div className={style.delete} onClick={e => handleDeleteUrl(e, index)}>X</div>
                        </div> 
                    )
                })
            }
            <button className={style.addUrl} onClick={handleAddUrl}>Add URL</button>
        </div>
    )
}

export default URLInput