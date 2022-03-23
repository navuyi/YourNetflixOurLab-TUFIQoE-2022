
import {DEFAULT_STORAGE, STORAGE_KEYS} from "../config";

export class Controller{
    constructor() {
       this.NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
    }

    async init(){
        console.log("[Controller] Initializing...")
        this.listenForVideoStart()
        await this.set_default_storage()
    }

    listenForVideoStart(){
        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if(changeInfo.status === "complete" && tab.url?.includes(this.NETFLIX_WATCH_URL)){
                console.log("Entered Netflix Player")

                /*
                  await chrome.scripting.executeScript({
                    target: {
                        tabId: tabId
                    },
                    files: ["contentScript.bundle.js"]
                })
                 */

                /*
                 console.log(tabId)
                await chrome.debugger.attach({tabId: tabId}, "1.3")

                console.log("Script injecteddddd")
                 */
            }
        })
    }

    async set_default_storage(){
        await chrome.storage.local.set(DEFAULT_STORAGE)
    }


}