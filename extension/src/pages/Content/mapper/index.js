import { STORAGE_KEYS } from "../../config"
import {MESSAGE_HEADERS, MESSAGE_TEMPLATE} from "../../config"
import Mapper from "./modules/Mapper"




const mapper = new Mapper()
mapper.init()



const redirect_to_next_video = async () => {
    const res = await chrome.storage.local.get([STORAGE_KEYS.VIDEO_COUNT, STORAGE_KEYS.VIDEO_LIMIT])
    const video_count = res[STORAGE_KEYS.VIDEO_COUNT]
    const video_limit = res[STORAGE_KEYS.VIDEO_LIMIT]
    const video_index = video_count - 1

    //const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

    console.log(`video_count: ${video_count}`)
    console.log(`video_limit: ${video_limit}`)
    

    if(video_count === video_limit){
        console.log("All videos mapped, rediracting to setup view")
        setTimeout(() => {
            chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.REDIRECT,
                [MESSAGE_TEMPLATE.DATA]: {
                    url: "setup.html"
                }
            })
        }, 3000)
    }
    else{
        console.log("Redirecting to the next video for mapping")
        const config = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const next_url = config.episodes[video_index+1].url
        setTimeout(() => {
            chrome.runtime.sendMessage({
                [MESSAGE_TEMPLATE.HEADER]: MESSAGE_HEADERS.REDIRECT,
                [MESSAGE_TEMPLATE.DATA]: {
                    url: next_url
                }
            })
        }, 3000)
    }
}