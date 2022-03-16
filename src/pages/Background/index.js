console.log('This is the background page.');
console.log('Put the background scripts here.');


import {one} from "./modules/one";


const NETFLIX_WATCH_URL = "https://www.netflix.com/watch"
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {


    if(changeInfo.status === "complete" && tab.url?.includes(NETFLIX_WATCH_URL)){
        console.log("Entered Netflix Player")
        one()
        await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            files: ["contentScript.bundle.js"]
        })

        console.log(tabId)
        await chrome.debugger.attach({tabId: tabId}, "1.3")

        console.log("Script injecteddddd")
    }
})