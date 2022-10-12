import {CustomLogger} from "../../../../utils/CustomLogger";


class BufferResetter{
    constructor() {
        this.logger = new CustomLogger("[BufferResetter]")
        this.inject_code()
    }


    async reset(){
        let interval = undefined
        const delay = 333

        return new Promise(resolve => {
            interval = setInterval(async () => {
                const seek_element = document.getElementById("seek_element")
                const video = document.getElementsByTagName("video")[0]

                if(seek_element != null && video != null){
                    clearInterval(interval) // Clear interval immediately !!!

                    // Pause, mute and hide video as soon as possible
                    video.style.opacity = "0"
                    video.pause()
                    video.muted = true

                    // Proceed with resetting
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.logger.log("Navigating to 1000th second of video")
                            seek_element.setAttribute("timestamp", String(1000))
                            seek_element.click()
                            resolve()
                        }, delay)
                    })

                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.logger.log("Navigating to the very beginning of the video")
                            seek_element.setAttribute("timestamp", String(0))
                            seek_element.click()
                            resolve()
                        }, delay)
                    })

                    await new Promise(resolve => {
                       setTimeout(() => {
                           this.logger.log("Resuming normal playback")
                           video.muted = false
                           video.style.opacity = "1"
                           video.play()
                           resolve()
                       }, delay)
                    })

                    resolve()
                }
                else{
                    // nothing, try again
                }
            }, 10)
        })
    }


    inject_code(){
        this.logger.log("Injecting netflixControls.bundle.js script into the page")
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL("netflixControls.bundle.js");

        (document.head || document.documentElement).appendChild(s);
        s.remove()
    }
}



export default BufferResetter