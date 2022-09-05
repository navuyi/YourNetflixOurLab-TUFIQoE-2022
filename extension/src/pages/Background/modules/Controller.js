import { get_local_datetime } from "../../../utils/time_utils"
import {EXTENSION_MODE_AVAILABLE, STORAGE_DEFAULT, STORAGE_KEYS} from "../../config"


export class Controller{
    constructor() {
       this.NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
    }

    async init(){
        console.log("[Controller] Initializing..." + get_local_datetime(new Date()))
        this.listenForVideoStart()
    }

    print(text){
        console.log(`[Controller] ${text}`)
    }

    async injectScript(tabId){
        const running = (await chrome.storage.local.get([STORAGE_KEYS.RUNNING]))[STORAGE_KEYS.RUNNING]
        const mode = (await chrome.storage.local.get([STORAGE_KEYS.EXTENSION_MODE]))[STORAGE_KEYS.EXTENSION_MODE]
        if(running === false){
            this.print("Extension is not running.")
            return
        }
        
        // Increase video count
        /**
         * 
        */
        await this.increaseVideoCount()

        // Define conent script file
        let content_script;
        if(mode === EXTENSION_MODE_AVAILABLE.EXPERIMENT){
            content_script = "mainContentScript.bundle.js"
        }
        else if(mode === EXTENSION_MODE_AVAILABLE.MAPPING){
            content_script = "mapperContentScript.bundle.js"
        }
        else(
            this.print("Content script is incorrect!!!")
        )

        await chrome.scripting.executeScript({
           target: {
                tabId: tabId
           },
            files: [content_script]  // ContentScript filename has to match names in webpack.config.js
        })
        this.print("ContentScript has been injected")
    }

    /**
     *  Method that keeps track of videos order and limit.
     *  For the first video in queue the count will be 1 but its index in an array is 0.
     *  Video count is increased just before injecting the ContentScript.
     *  It means that n-th video in row has the count of n for the enterity of playback. The index is n-1  
    */
    async increaseVideoCount(){
        const count = (await chrome.storage.local.get([STORAGE_KEYS.VIDEO_COUNT]))[STORAGE_KEYS.VIDEO_COUNT]
        const new_count = count+1
        this.print(`Increasing video count to ${new_count}`)
        await chrome.storage.local.set({
            [STORAGE_KEYS.VIDEO_COUNT]: new_count
        })
    }



    listenForVideoStart(){
        // Code below seems to be the right solution //

        // onHistoryStateUpdated detects navigation within Netlifx player (next video button)
        /*
        chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
            this.print(`ON HISTORY STATE UPDATED`)
            console.log(details)
            if(details.frameId === 0 && details.url.includes(this.NETFLIX_WATCH_URL)) {
                chrome.tabs.get(details.tabId, async (tab) => {
                    if(tab.url === details.url) {
                        this.print("Entered Netflix Video Player")
                        await this.injectScript(details.tabId)
                    }
                });
            }
        });
        */
        // onCompleted detects navigation using chrome.tabs.update
        chrome.webNavigation.onCompleted.addListener(details => {
            this.print(`ON COMPLETED`)
            console.log(details)
            if(details.frameId === 0 && details.url.includes(this.NETFLIX_WATCH_URL)) {
                chrome.tabs.get(details.tabId, async (tab) => {
                    if(tab.url === details.url) {
                        this.print("Entered Netflix Video Player")
                        await this.injectScript(details.tabId)
                    }
                });
            }
        })
    }

    /////////
}