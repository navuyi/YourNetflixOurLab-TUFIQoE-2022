import { get_local_datetime } from "../../../utils/time_utils"
import {EXTENSION_MODE_AVAILABLE, STORAGE_DEFAULT, STORAGE_KEYS} from "../../config"
import { CustomLogger } from "../../../utils/CustomLogger"

export class Controller{
    constructor() {
       this.NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
       this.logger = new CustomLogger("[Controller]")
    }

    async init(){
        this.logger.log("Initializing...")
        this.listenForVideoStart()
    }

    

    async injectScript(tabId){
        const running = (await chrome.storage.local.get([STORAGE_KEYS.RUNNING]))[STORAGE_KEYS.RUNNING]
        const mode = (await chrome.storage.local.get([STORAGE_KEYS.EXTENSION_MODE]))[STORAGE_KEYS.EXTENSION_MODE]
        if(running === false){
            this.logger.log("Extension is not running.")
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
            this.logger.log("Experiment mode detected. Switching to mainContentScript.bundle.js")
            content_script = "mainContentScript.bundle.js"
        }
        else if(mode === EXTENSION_MODE_AVAILABLE.MAPPING){
            this.logger.log("Mapping mode detected. Switching to mapperContentScript.bundle.js")
            content_script = "mapperContentScript.bundle.js"
        }
        else(
            this.logger.log("Content script is incorrect!!!")
        )

        await chrome.scripting.executeScript({
           target: {
                tabId: tabId
           },
            files: [content_script]  // ContentScript filename has to match names in webpack.config.js
        })
        this.logger.log("ContentScript has been injected")
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
        this.logger.log(`Increasing video count to ${new_count}`)
        await chrome.storage.local.set({
            [STORAGE_KEYS.VIDEO_COUNT]: new_count
        })
    }



    listenForVideoStart(){
        // Code below seems to be the right solution //

        // onHistoryStateUpdated detects navigation within Netlifx player (next video button)
        /*
        chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
            this.logger.log(`ON HISTORY STATE UPDATED`)
            console.log(details)
            if(details.frameId === 0 && details.url.includes(this.NETFLIX_WATCH_URL)) {
                chrome.tabs.get(details.tabId, async (tab) => {
                    if(tab.url === details.url) {
                        this.logger.log("Entered Netflix Video Player")
                        await this.injectScript(details.tabId)
                    }
                });
            }
        });
        */
        // onCompleted detects navigation using chrome.tabs.update
        chrome.webNavigation.onCompleted.addListener(details => {
            this.logger.log(`ON COMPLETED`)
            this.logger.log(details)
            if(details.frameId === 0 && details.url.includes(this.NETFLIX_WATCH_URL)) {
                chrome.tabs.get(details.tabId, async (tab) => {
                    if(tab.url === details.url) {
                        this.logger.log("Entered Netflix Video Player")
                        await this.injectScript(details.tabId)
                    }
                });
            }
        })
    }

    /////////
}