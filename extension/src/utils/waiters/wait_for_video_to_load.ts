
/**
 * Function waits for the essential html elements to be loaded and available for manipulation.
 * @returns {Promise<unknown>}
 */
export const wait_for_video_to_load = async () : Promise<void>=> {
    return new Promise((resolve) => {
        let interval : ReturnType<typeof setInterval>
        
        interval = setInterval(async () => {
            try {
                const video = document.getElementsByTagName("video")[0]
                const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0]

                if (video && video_canvas) {
                    clearInterval(interval) // stop the retrying process - must be first
                    console.log("HTML video element is loaded. Proceeding...")
                    resolve()
                }
                else{
                    console.log("Video element not found! Retrying...")
                }
            } catch (err) {
                console.log(err)
            }
        }, 10)
    })
}