

import {STORAGE_KEYS} from "../../config"
import { STORAGE_DEFAULT} from "../../config"

export class Controller{
    constructor() {
       this.NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
    }

    async init(){
        console.log("[Controller] Initializing...")
        this.listenForVideoStart()
    }

    print(text){
        console.log(`[Controller] ${text}`)
    }

    async injectScript(tabId){
        // Increment EPISODE_COUNT
        const count = (await chrome.storage.local.get([STORAGE_KEYS.EPISODE_COUNT]))[STORAGE_KEYS.EPISODE_COUNT]
        await chrome.storage.local.set({
            [STORAGE_KEYS.EPISODE_COUNT]: count+1
        })

        await chrome.scripting.executeScript({
           target: {
                tabId: tabId
           },
            files: ["contentScript.bundle.js"]
        })
        this.print("ContentScript has been injected")
    }



    listenForVideoStart(){
        // Code below seems to be the right solution //

        // onHistoryStateUpdated detects navigation within Netlifx player (next video button)
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