import { wait_for_video_to_load } from "../../../../utils/waiters/wait_for_video_to_load";
import { CustomLogger } from "../../../../utils/custom/CustomLogger";


export class CustomPlayer{
    private logger : CustomLogger
    private elements_to_remove = ["control-play-pause-pause", "control-play-pause-play", "control-back10", 
        "control-forward10", "control-speed","control-episodes","control-next","timeline-bar"]

    private elements_to_leave = [
        "control-volume-off",
        "control-volume-low",
        "control-volume-medium",
        "control-volume-high",
        "control-audio-subtitle",
        "control-fullscreen-enter",
        "control-fullscreen-exit"
    ]
    
    constructor() {
        this.logger = new CustomLogger("[CustomPlayer]")
    }

    public init = async () : Promise<void> => {
        await wait_for_video_to_load()

        this.create_shutter()

        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0] as HTMLElement

        video_canvas.onmousemove = () => {
            let controls_container = document.getElementsByClassName("watch-video--bottom-controls-container")[0]

            this.elements_to_remove.forEach(element_data_uia => {
                const element = this.get_element(controls_container, element_data_uia)
                if(element) element.remove()
            })

            this.elements_to_leave.forEach(element_data_uia => {
                const element = this.get_element(controls_container, element_data_uia)
                if(element) this.modify_element(element)
            })
        }
    }

    private modify_element(element : Element){
        if(element && element.parentNode){
            const el = element as HTMLElement
            const parent_node = element.parentNode as HTMLElement
            
            el.style.zIndex = "10100"
            parent_node.style.zIndex = "10100"
        }
    }

    private get_element = (container : Element, element_data_uia : string) : Element => {
        const selector = `[data-uia='${element_data_uia}']`
        return container.querySelectorAll(selector)[0] 
    }

    private create_shutter(){
        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0] as HTMLElement
        video_canvas.style.willChange = "unset" // <-- this is essential - in YourNetflixOurLab it was done in AssessmentManager

        const shutter = document.createElement("div")
        shutter.id = "transparent_panel"

        shutter.style.width = "100vw"; shutter.style.height = "100vh";
        shutter.style.position = "absolute"; shutter.style.left= "0"; shutter.style.top = "0";
        shutter.style.backgroundColor= "lightblue";
        shutter.style.display = "flex";
        shutter.style.justifyContent = "center"; shutter.style.alignItems = "center"; shutter.style.flexDirection = "column"
        shutter.style.zIndex = "10000"
        shutter.style.opacity = "0"

        shutter.onclick = (e) => {
            e.stopPropagation()
        }

        video_canvas.appendChild(shutter)
    }
}