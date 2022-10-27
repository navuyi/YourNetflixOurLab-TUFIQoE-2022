import {wait_for_video_to_load} from "../../utils/wait_for_video_to_load";
import {CustomLogger} from "../../../../utils/CustomLogger";


export class CustomPlayer{

    constructor() {
        this.logger = new CustomLogger("[CustomPlayer]")
    }


    update_volume_display(){
        const v = document.getElementsByTagName("video")[0]
        const volume = v.volume
        document.getElementById("volume_display").innerText = this.convert_to_percentage(volume) + " %"
    }

    convert_to_percentage(value){
        return (value*100).toFixed(0)
    }


    increment_volume(){
        let v = document.getElementsByTagName("video")[0]
        if(v.volume + 0.05 < 1){
            v.volume += 0.05
        }else{
            v.volume = 1
        }
        this.update_volume_display()
    }

    decrement_volume(){
        let v = document.getElementsByTagName("video")[0]
        if(v.volume - 0.05 > 0){
            v.volume -= 0.05
        }
        else{
            v.volume = 0
        }
        this.update_volume_display()
    }

    create_controls_container(){
        const container = document.createElement("div")
        container.style.width = "200px"
        container.style.display = "flex"
        container.style.justifyContent = "space-between"
        container.style.alignItems = "center"

        return container
    }

    create_volume_display(){
        const display = document.createElement("div")
        display.id = "volume_display"
        display.innerText = (document.getElementsByTagName("video")[0].volume * 100).toFixed(0) + " %"

        display.style.fontSize = "24px"
        display.style.fontWeight = "bold"

        return display
    }

    async init(){
       await this.create_shutter()

        const down = this.create_volume_button("volume_down", "-")
        const up = this.create_volume_button("volume_up", "+")
        const container = this.create_controls_container()
        const display = this.create_volume_display()

        down.onclick = this.decrement_volume.bind(this)
        up.onclick = this.increment_volume.bind(this)



        container.appendChild(down)
        container.appendChild(display)
        container.appendChild(up)

        container.style.zIndex = "10100"
        container.onclick = e => e.stopPropagation()

        const ltr_element = document.querySelectorAll("[data-uia='video-canvas']")[0]
        ltr_element.addEventListener("mousemove", () => {
            let controls_container = document.getElementsByClassName("watch-video--bottom-controls-container")[0]
            controls_container ? controls_container.replaceChildren(container) : null
        })
    }

    create_volume_button(id, inner_text){
        const btn = document.createElement("button")
        btn.style.outline = "none"
        btn.style.border = "none"
        btn.style.fontSize = "24px"
        btn.style.fontWeight = "bold"

        btn.innerText = inner_text
        btn.style.width = "50px"
        btn.style.height = "50px"
        btn.style.margin = "20px 0"
        btn.style.backgroundColor = "whitesmoke"
        btn.style.color = "black"

        btn.style.userSelect = "none"
        btn.style.borderRadius = "50%"
        btn.style.opacity = "0.6"

        btn.style.display = "flex"
        btn.style.alignItems = "center"
        btn.style.justifyContent = "center"


        btn.onmouseenter = () => {
            btn.style.backgroundColor = "white"
        }
        btn.onmouseleave = () => {
            btn.style.backgroundColor = "whitesmoke"
        }

        btn.onmousedown = () => {
            btn.style.boxShadow = "0px 0px 15px rgba(255,255,255,1)"
        }
        btn.onmouseup = () => {
            btn.style.boxShadow = "unset"
        }

        return btn
    }


    async create_shutter(){
        await wait_for_video_to_load()
        const ltr_element = document.querySelectorAll("[data-uia='video-canvas']")[0]

        const panel = this.create_transparent_panel()

        ltr_element.appendChild(panel)
    }



    create_transparent_panel(){
        const panel = document.createElement("div")
        panel.id = "transparent_panel"

        panel.style.width = "100vw"; panel.style.height = "100vh";
        panel.style.position = "absolute"; panel.style.left= "0"; panel.style.top = "0";
        panel.style.backgroundColor= "lightblue";
        panel.style.display = "flex"; panel.style.justifyContent = "center"; panel.style.alignItems = "center"; panel.style.flexDirection = "column"
        panel.style.zIndex = "10000"
        panel.style.opacity = "0"


        panel.onclick = (e) => {
            e.stopPropagation()
        }

        return panel
    }
}