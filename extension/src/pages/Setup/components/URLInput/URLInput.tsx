import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from "react"
import { Dispatch } from "redux"
import style from "./style.module.scss"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { MouseEvent } from "react"
import { useSelector } from "react-redux"
import { T_APP_STATE } from "../../redux/reducers"
import { useURLInput } from "./useURLInput"

type T_PROPS = {
    attributes: object
}

const URLInput = (props:T_PROPS) => {
    const setup = useSelector((state:T_APP_STATE) => state.setup)
    const {handleAddUrl, handleChange, handleDeleteUrl} = useURLInput()

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