import {wait_for_video_to_load} from "../../utils/wait_for_video_to_load";
import {CustomLogger} from "../../../../utils/CustomLogger";


export class CustomPlayer{

    constructor() {
        this.logger = new CustomLogger("[CustomPlayer]")
        this.elements_to_remove = [
            "control-play-pause-pause",
            "control-play-pause-play",
            "control-back10",
            "control-forward10",
            "control-speed",
            "control-fullscreen-enter",
            "control-fullscreen-exit",
            "control-episodes",
            "control-next",
            "timeline-bar"
        ]
        this.elements_to_leave = [
            "control-volume-off",
            "control-volume-low",
            "control-volume-medium",
            "control-volume-high",
            "control-audio-subtitle"
        ]
    }

    async init(){
        await wait_for_video_to_load()

        await this.create_shutter()

        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0]
        video_canvas.addEventListener("mousemove", () => {
            let controls_container = document.getElementsByClassName("watch-video--bottom-controls-container")[0]

            this.elements_to_remove.forEach(element_data_uia => {
                const element = this.get_element(controls_container, element_data_uia)
                if(element) element.remove()
            })

            this.elements_to_leave.forEach(element_data_uia => {
                const element = this.get_element(controls_container, element_data_uia)
                if(element) this.modify_element(element)
            })
        })
    }

    modify_element(element){
        element.style.zIndex = "10100"
        element.parentNode.style.zIndex = "10100"
    }

    get_element(container, element_data_uia){
        const selector = `[data-uia='${element_data_uia}']`
        return container.querySelectorAll(selector)[0]
    }

    async create_shutter(){
        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0]

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