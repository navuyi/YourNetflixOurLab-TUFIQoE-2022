import { ChromeStorage } from "../../../utils/custom/ChromeStorage"
import { CustomLogger } from "../../../utils/custom/CustomLogger"

const NETFLIX_WATCH_URL = "https://www.netflix.com/watch"

export class Controller{
    private logger : CustomLogger

    constructor() {
       this.logger = new CustomLogger("[Controller]")
    }

    public init = async () : Promise<void> => {
        this.logger.log("Initializing...")
        this.listenForVideoStart()
    }

    private injectScript = async (tabId:number) : Promise<void> => {
        const variables = await ChromeStorage.get_experiment_variables()
        const running = variables.extension_running
        const mode = variables.extension_mode
        if(running === false){
            this.logger.log("Extension is not running.")
            return
        }
        

        // Define conent script file
        let content_script;
        if(mode === "main"){
            this.logger.log("Experiment mode detected. Switching to mainContentScript.bundle.js")
            content_script = "mainContentScript.bundle.js"
        }
        else if(mode === "mapping"){
            this.logger.log("Mapping mode detected. Switching to mapperContentScript.bundle.js")
            content_script = "mapperContentScript.bundle.js"
        }
        else{
            this.logger.log("Extension mode is set up incorrectly")
            return
        }

        await chrome.scripting.executeScript({
           target: {
                tabId: tabId
           },
            files: [content_script]  // ContentScript filename has to match names in webpack.config.js
        })
        this.logger.log("ContentScript has been injected")
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
            if(details.frameId === 0 && details.url.includes(NETFLIX_WATCH_URL)) {
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