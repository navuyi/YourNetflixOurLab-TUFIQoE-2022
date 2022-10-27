import {wait_for_video_to_load} from "../../utils/wait_for_video_to_load";
import {CustomLogger} from "../../../../utils/CustomLogger";
import {remove_whitespaces} from "../../../../utils/string_utils";


export class CustomPlayer{

    constructor() {
        this.logger = new CustomLogger("[CustomPlayer]")
    }


    async init(){
       await this.create_shutter()

        const down = this.create_volume_button("volume_down", "-")
        const up = this.create_volume_button("volume_up", "+")

        down.onclick = () => {
           let v = document.getElementsByTagName("video")[0]
            if(v.volume - 0.05 > 0){
                v.volume -= 0.05
            }
            else{
                v.volume = 0
            }
            document.getElementById("volume_level").innerText = (document.getElementsByTagName("video")[0].volume * 100).toFixed(0) + " %"
        }


        up.onclick = () => {
            let v = document.getElementsByTagName("video")[0]
            if(v.volume + 0.05 < 1){
                v.volume += 0.05
            }else{
                v.volume = 1
            }
            document.getElementById("volume_level").innerText = (document.getElementsByTagName("video")[0].volume * 100).toFixed(0) + " %"
        }

        const controls = document.createElement("div")
        controls.style.width = "200px"
        controls.style.display = "flex"
        controls.style.justifyContent = "space-between"
        controls.style.alignItems = "center"

        const counter = document.createElement("div")
        counter.id = "volume_level"
        counter.innerText = (document.getElementsByTagName("video")[0].volume * 100).toFixed(0) + " %"

        counter.style.fontSize = "24px"
        counter.style.fontWeight = "bold"

        controls.appendChild(down)
        controls.appendChild(counter)
        controls.appendChild(up)



        controls.style.zIndex = "10100"
        controls.onclick = e => e.stopPropagation()

        const ltr_element = document.querySelectorAll("[data-uia='video-canvas']")[0]
        ltr_element.addEventListener("mousemove", () => {
            let controls_container = document.getElementsByClassName("watch-video--bottom-controls-container")[0]
            controls_container ? controls_container.replaceChildren(controls) : null
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