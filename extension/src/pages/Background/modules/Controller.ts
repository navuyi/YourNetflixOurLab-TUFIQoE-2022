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
        const running = variables.experiment_running
        const mode = variables.extension_mode
        if(running === false){
            this.logger.log("Extension is not running.")
            return
        }
        
       
        await this.increaseVideoCount()

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

    /**
     *  Method that keeps track of videos order and limit.
     *  For the first video in queue the count will be 1 but its index in an array is 0.
     *  Video count is increased just before injecting the ContentScript.
     *  It means that n-th video in row has the count of n for the enterity of playback. The index is n-1  
    */
    async increaseVideoCount(){
        const variables = await ChromeStorage.get_experiment_variables()
        const video_index = variables.video_index
        const next_video_index = video_index + 1
        this.logger.log(`Increasing video count to ${next_video_index}`)
        variables.video_index = next_video_index
        await ChromeStorage.set_experiment_variables(variables)
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