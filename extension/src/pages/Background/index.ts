import {MESSAGE_HEADERS} from "../config"
import {Controller} from "./modules/Controller"
import { STORAGE_DEFAULT } from "../config"
import { get_local_datetime } from "../../utils/time_utils"
import { T_MESSAGE } from "../../config/messages.config"

/**
 * Detect extension reloads and perform actions.
 * This listener callback executes only when extension is installed or reloaded. 
*/
chrome.runtime.onInstalled.addListener(() => {
    console.log(`[BackgroundScript] | ${get_local_datetime(new Date())} | Installing...` )

     // Initialize local storage || WARNING --> THIS RESETS ALL chrome.storage KEYS TO DEFAULT VALUES
     chrome.storage.local.set(STORAGE_DEFAULT)
})

chrome.action.onClicked.addListener(async (tab) => {
    if(tab && tab.id){
        await chrome.tabs.update(tab.id, {
            url: "setup.html"
        })
    } 
})


/** Message listeners
 * DO NOT USE await inside onMessage listener callback's body.
 * REMEMBER to return true at the end of the onMessage listener callback's body.
 * 
 * Returning true at the end tells the other side of connection to wait for response
 * that will asynchronously, that is why sendResponse is mandatory.
 * Using await inside callback's body would result in errors.
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // do not use async/await within listener callback

    /*no await!!!*/ receive_finished_signal(message, sender, sendResponse)
    /*no await!!!*/ receive_redirect_signal(message, sender, sendResponse) 

    return true     // return true is essential to indicate that response will be sent asynchronously
})

// Initialize Controller instance
const controller = new Controller()
controller.init()

/** 
 * Function checks if received message is signal indicating end of video
 * Redirects the tab that the message came from to the custom web page
 * REMEMBER to use sendResponse !!!
*/
const receive_finished_signal = async (message:T_MESSAGE, sender:chrome.runtime.MessageSender, sendResponse:Function) => {
    if(message.header === MESSAGE_HEADERS.FINISHED){
       if(sender.tab){
         // Redirect to custom webpage
         const tabId = Number(sender.tab.id)
         await chrome.tabs.update(tabId, {
             url: "break.html"
         })
         sendResponse({msg: "Finish signal received"}) // sendResponse is essential
       }
    }
}

const receive_redirect_signal = async (message:T_MESSAGE, sender:chrome.runtime.MessageSender, sendResponse:Function) => {
    if(message.header === MESSAGE_HEADERS.REDIRECT){
        if(sender.tab){
            const tabId = Number(sender.tab.id)
            await chrome.tabs.update(tabId, {
                url: message.data.url
            })
    
            sendResponse({msg: "Redirect signal received"}) // sendResponse is essential
        } 
    }
}
