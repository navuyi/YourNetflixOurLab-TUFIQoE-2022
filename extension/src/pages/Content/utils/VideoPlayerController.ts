import {CustomLogger} from "../../../utils/CustomLogger";

class VideoPlayerController{
    private status: number = 10
    private logger: CustomLogger;

    constructor() {
        this.logger = new CustomLogger("[VideoPlayerController")
    }

    public async init():Promise<void>{

    }

    private get_watch_video_element():Promise<HTMLElement> {
        return new Promise(resolve => {
            let interval: NodeJS.Timer | undefined = undefined


        })
    }

    private async show_controls():Promise<void>{
        this.logger.log("Dispatching mousemove event !!!")
        const element:HTMLElement = await this.get_watch_video_element()
        element.dispatchEvent(new MouseEvent("mousemove", {bubbles: true, button: 0}))
    }
}



export default VideoPlayerController