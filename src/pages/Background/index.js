import {MESSAGE_HEADERS, MESSAGE_TEMPLATE, STORAGE_KEYS, ARCHIVE_DEFAULT} from "../config"
import {Controller} from "./modules/Controller"
import { DATABASE_KEYS, DATABASE_DEFAULT, ASSESSMENTS_DEFAULT, STORAGE_DEFAULT } from "../config"
import { test_chrome_storage } from "../../../test/test_chrome_storage"
import { get_local_datetime } from "../../utils/time_utils"

console.log("[BackgroundScript] Initializing all " + get_local_datetime(new Date()))
let database = DATABASE_DEFAULT                     // for storing processed data from video playback (nerd stats)
let archive = ARCHIVE_DEFAULT                          // for storing unprocessed (raw) data from video playback (nerd stats raw string)
let assessments = ASSESSMENTS_DEFAULT         // for storing user assessments

// Initialize local storage
chrome.storage.local.set(STORAGE_DEFAULT)

chrome.runtime.onInstalled.addListener(() => {
    console.log("I've just been installed!!!  " + get_local_datetime(new Date()))
})

// Chrome debugger listeners
/*
chrome.debugger.onDetach.addListener((data) => {
    console.log(`[BackgroundScript] Debugger detached!!!!`)
    console.log(data)
})
*/


// Message listeners //
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // do not use async/await within listener callback

    //receive_data_msg(message, sender, sendResponse)
    //receive_assessment(message, sender, sendResponse)
    receive_finished_signal(message, sender, sendResponse)
    receive_emergency_save_data_signal(message, sender, sendResponse)

    return true     // return true is essential to indicate that response will be sent asynchronously
})

// Initialize Controller instance
const controller = new Controller()
controller.init()



// Utility functions
const receive_data_msg = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.NERD_STATISTICS){

        const data = message[MESSAGE_TEMPLATE.DATA]
        const _archive = message[MESSAGE_TEMPLATE.ARCHIVE]

        // Store playback data
        for(const key in data){
            database[key].push(data[key])
        }
        
        console.log(database)

        // Store archive
        for(const key in _archive){
            archive[key].push(_archive[key])
        }
       
        console.log(archive)
    }
}

const receive_emergency_save_data_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === "SAVE_DATA"){
        const tabs = await chrome.tabs.query({active: true, currentWindow: true})
        await chrome.scripting.executeScript({
            target: {
                 tabId: tabs[0].id
            },
             files: ["testScript.bundle.js"]
         })
        sendResponse({msg: "Signal received. Content script injected"})
    }
}


const receive_finished_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.FINISHED){

        /*
        await chrome.storage.local.set({
            [STORAGE_KEYS.DATA_TO_SAVE]: database,
            [STORAGE_KEYS.ARCHIVE_TO_SAVE]: archive,
            [STORAGE_KEYS.ASSESSMENTS_TO_SAVE]: assessments
        })
        */
       
        // Reset local database
        //reset_database()
        //reset_archive()
        //reset_assessments()

        // Redirect to newtab (saving page)
        const tabId = sender.tab.id
        await chrome.tabs.update(tabId, {
            url: "newtab.html"
        })
        sendResponse({msg: "Finish signal received"})
    }
}


const receive_assessment = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.ASSESSMENT){
        const data = message[MESSAGE_TEMPLATE.DATA]
        for(const key in data){
            assessments[key].push(data[key])
        }
        console.log(assessments)
        sendResponse({msg: "Received assessment data"})
    }
}


const reset_database = () => {
    for(const key in database){
        database[key] = []
    }
}

const reset_archive = () => {
    for(const key in archive){
        archive[key] = []
    }
}

const reset_assessments = () => {
    for(const key in assessments){
        assessments[key] = []
    }
}




//test_chrome_storage()







