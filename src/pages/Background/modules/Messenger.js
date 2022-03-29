import { MESSAGE, MESSAGE_FORMAT, MESSAGE_HEADERS, STORAGE_KEYS } from "../../config"

export class Messenger{
    constructor(data_array){
        this.data_array = data_array
    }


    async init(){
        this.listen_for_messages()
    }


    listen_for_messages(){
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("Asdasdasd")
            if(message[MESSAGE_FORMAT.HEADER] === MESSAGE_HEADERS.NERD_STATISTICS){
                const data = message[MESSAGE_FORMAT.DATA]
                //TODO Collect received data in array-like manner
            }
        })
    }

    async handle_nerdstats_msg(){

    }
}