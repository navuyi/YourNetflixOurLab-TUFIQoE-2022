import {MESSAGE_HEADERS, MESSAGE_TEMPLATE} from "../config"
import {Controller} from "./modules/Controller"
import { STORAGE_DEFAULT } from "../config"

import { get_local_datetime } from "../../utils/time_utils"




chrome.runtime.onInstalled.addListener(() => {
    console.log("[BackgroundScript] Installing... " + get_local_datetime(new Date()))

     // Initialize local storage || WARNING --> THIS RESETS ALL chrome.storage KEYS TO DEFAULT VALUES
     chrome.storage.local.set(STORAGE_DEFAULT)
    
})



// Message listeners //
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // do not use async/await within listener callback

    /*no await!!!*/ receive_finished_signal(message, sender, sendResponse)
    /*no await!!!*/ receive_emergency_save_data_signal(message, sender, sendResponse)

    return true     // return true is essential to indicate that response will be sent asynchronously
})

// Initialize Controller instance
const controller = new Controller()
controller.init()



 // Signal handlers
 const receive_emergency_save_data_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === "SAVE_DATA"){
        const tabs = await chrome.tabs.query({active: true, currentWindow: true})
        await chrome.scripting.executeScript({
            target: {
                tabId: tabs[0].id
            },
            files: ["testScript.bundle.js"]
        })
        sendResponse({msg: "Signal received. Content script injected"}) // Essential sendResponse
    }
}

const receive_finished_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.FINISHED){
        // Redirect to newtab (saving page)
        const tabId = sender.tab.id
        await chrome.tabs.update(tabId, {
            url: "newtab.html"
        })
        sendResponse({msg: "Finish signal received"}) // Essential sendResponse
    }
}

