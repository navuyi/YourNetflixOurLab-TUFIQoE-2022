import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from "react"
import style from "./style.module.scss"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { MouseEvent } from "react"

const URLInput = () => {
    const [urls, setUrls] = useState<Array<string>>([])


    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            setUrls(settings.urls)
            console.log("rerender")
        }

        init()
    }, [])

    useEffect(() => {
        const updateStorage = async () => {
            await ChromeStorage.update_experiment_settings_property("urls", urls)
        }
        updateStorage()
    }, [urls])

    const handleChange = (e:ChangeEvent<HTMLInputElement>, index:number) => {
        const tmp = [...urls]
        tmp[index] = e.currentTarget.value
        setUrls(tmp)

        //TODO - Update chrome storage 
    }

    const handleDeleteUrl = (e:MouseEvent<HTMLDivElement>, index: number) => {
        const tmp = [...urls]
        tmp.splice(index, 1)
        setUrls(tmp)
    }

    const handleAddUrl = () => {
        const tmp = [...urls]
        tmp.push("")
        setUrls(tmp)
    }

    return(
        <div className={style.urlInput}>
            {
                urls.map((url, index) => {
                    return (
                        <div className={style.urlWrapper} key={index}>
                            <input className={style.url} value={url} onChange={e => handleChange(e, index)}/>
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