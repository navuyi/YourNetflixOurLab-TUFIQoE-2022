

import {STORAGE_KEYS} from "../../config"
import { DEFAULT_STORAGE } from "../../config"

export class Controller{
    constructor() {
       this.NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
       this.BLOCKADE_LIFETIME_MS = 3000
       this.blockade = false
    }

    async init(){
        console.log("[Controller] Initializing...")
        await this.set_default_storage()
        this.listenForVideoStart()
    }

    async print(text){
        console.log(`[Controller] ${text}`)
    }

    async injectScript(tabId){
        // Increment SESSION_INDEX
        const index = (await chrome.storage.local.get([STORAGE_KEYS.SESSION_INDEX]))[STORAGE_KEYS.SESSION_INDEX]
        console.log(index+1)
        await chrome.storage.local.set({
            [STORAGE_KEYS.SESSION_INDEX]: index+1
        })

        await chrome.scripting.executeScript({
           target: {
                tabId: tabId
           },
            files: ["contentScript.bundle.js"]
        })
        this.print("ContentScript has been injected")
    }

    async set_default_storage(){
        await chrome.storage.local.set(DEFAULT_STORAGE)
    }

    async listenForVideoStart(){
        chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
            if(details.frameId === 0 & details.url.includes(this.NETFLIX_WATCH_URL)){
                if(this.blockade === false){
                    this.print("Entered Netflix Video Player")
                    const tab = await chrome.tabs.get(details.tabId)
                    await this.injectScript(details.tabId)

                    // Set blockade to true in order to prevent multiple content script injection
                    this.blockade = true
                    setTimeout(() => {
                        this.print("Setting blockade back to false")
                        this.blockade = false
                    }, this.BLOCKADE_LIFETIME_MS)
                }
            }
        })
    }

    


}