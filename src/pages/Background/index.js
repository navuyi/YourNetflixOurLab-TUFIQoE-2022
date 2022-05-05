import {MESSAGE_HEADERS, MESSAGE_TEMPLATE, STORAGE_KEYS, ARCHIVE_DEFAULT} from "../config"
import {Controller} from "./modules/Controller"
import { DATABASE_KEYS, DATABASE_DEFAULT, ASSESSMENTS_DEFAULT, STORAGE_DEFAULT } from "../config"

let database = DATABASE_DEFAULT                     // for storing processed data from video playback (nerd stats)
let archive = ARCHIVE_DEFAULT                          // for storing unprocessed (raw) data from video playback (nerd stats raw string)
let assessments = ASSESSMENTS_DEFAULT         // for storing user assessments

// Initialize local storage
chrome.storage.local.set(STORAGE_DEFAULT)

// Chrome debugger listeners
chrome.debugger.onDetach.addListener((data) => {
    console.log(`[BackgroundScript] Debugger detached!!!!`)
    console.log(data)
})

// Message listeners //
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // do not use async/await within listener callback

    receive_data_msg(message, sender, sendResponse)
    receive_finished_signal(message, sender, sendResponse)
    receive_credits_signal(message, sender, sendResponse)

    return true     // return true is essential
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

        // Save database and archive in chrome.storage
        //await chrome.storage.local.set({
        //    [STORAGE_KEYS.DATA_TO_SAVE]: database,
        //    [STORAGE_KEYS.ARCHIVE_TO_SAVE]: archive
        //})
    }
    sendResponse({msg: "OK"})
}


const receive_finished_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.FINISHED){

        await chrome.storage.local.set({
            [STORAGE_KEYS.DATA_TO_SAVE]: database,
            [STORAGE_KEYS.ARCHIVE_TO_SAVE]: archive
        })

        // Reset local database
        reset_database()
        reset_archive()

        // Redirect to newtab (saving page)
        const tabId = sender.tab.id
        console.log(tabId)
        await chrome.tabs.update(tabId, {
            url: "newtab.html"
        })
    }
    sendResponse({msg: "OK"})
}

const receive_credits_signal = async (message, sender, sendResponse) => {
    if(message[MESSAGE_TEMPLATE.HEADER] === MESSAGE_HEADERS.CREDITS){

        await chrome.storage.local.set({
            [STORAGE_KEYS.DATA_TO_SAVE]: database,
            [STORAGE_KEYS.ARCHIVE_TO_SAVE]: archive
        })

        // Reset local database
        reset_database()
        reset_archive()
    }
    sendResponse({msg: "OK"})
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







