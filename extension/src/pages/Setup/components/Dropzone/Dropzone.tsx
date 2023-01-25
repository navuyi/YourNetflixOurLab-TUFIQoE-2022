import React, { DragEvent } from "react";
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage";
import { useConfig } from "../../hooks/useConfig";
import style from "./style.module.scss"



const Dropzone = () => {
    const {save_config} = useConfig()

    const handleDragOver = (e : DragEvent) => {
        console.log("in dropzone")
        e.preventDefault()
    }

    const handleDragEnter = (e : DragEvent) => {
        e.currentTarget.setAttribute("dragover", "true")
    }
    const handleDragLeave = (e : DragEvent) => {
        e.currentTarget.removeAttribute("dragover")
    }

    const handleDrop = (e : DragEvent) => {
        e.currentTarget.removeAttribute("dragover")
        e.preventDefault()

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            const file = e.dataTransfer.files[0]
            if(file != null && file.type !== 'application/json'){
                window.alert("Invalid type of file")
                return
            }

            const reader = new FileReader()
            reader.onload = async (e : ProgressEvent<FileReader>) : Promise<void> => {
                if(e.target == null){
                    console.error("File reader event target is null or undefined")
                    return
                }
                const config = JSON.parse(e.target.result as string)
                save_config(config)
            }

            reader.readAsText(file)
        }
        else{
            console.log("Cannot handle file")
        }
    }
    
    return(
        <div className={style.dropzone} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <span className={style.text}>Drop config file here to continue</span>
        </div>
    )
}



export default Dropzone