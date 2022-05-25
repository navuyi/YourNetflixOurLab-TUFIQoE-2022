import { get_local_datetime, get_local_datetime_and_timezone } from "../../../utils/time_utils"
import { ASSESSMENTS_DEFAULT, MESSAGE_HEADERS, MESSAGE_TEMPLATE, STORAGE_KEYS } from "../../config"


export class AssessmentManager{
    constructor() {
        this.interval = undefined
    }



    async init(){
        await this.init_popup()
        this.start_assessment_process()
    }

    print(text){
        console.log(`[AssessmentManager] ${text}`)
    }

    start_assessment_process(){
        this.interval = setInterval(() => {
            const popup = document.getElementById("assessment-popup")
            popup.style.display = "unset"

        }, 150000) // <-- to be changed, value from config 150000
    }

    async init_popup(){
        return new Promise(resolve => {
            const popup = document.createElement("div")
            const background = this.create_background()
            const buttons = this.create_buttons()

            buttons.forEach(btn => {
            background.appendChild(btn)
            })

            popup.id = "assessment-popup"
            popup.style.display = "none"
            popup.appendChild(background)

            let interval = undefined
            interval = setInterval(() => {
                try{
                    const video = document.getElementsByTagName("video")[0]
                    const video_div = video.parentElement
                    const ltr_element = document.querySelectorAll("[data-uia='video-canvas']")[0]

                    console.log(video)
                    console.log(video_div)
                    console.log(ltr_element)

                    if(video && video_div && ltr_element){
                        clearInterval(interval) // stop the retrying process
                        video_div.appendChild(popup)    // add popup to the DOM
                        ltr_element.style.willChange = "unset"  // make popup clickable
                        resolve(true)
                    }
                }
                catch(err){
                    console.log(err)
                }
            }, 500)
        })
    }

    create_background(){
        const background = document.createElement("div")
        background.style.width = "100vw"; background.style.height = "100vh";
        background.style.position = "absolute"; background.style.left= "0"; background.style.top = "0";
        background.style.backgroundColor = "#222222";
        background.style.opacity = "0.8";
        background.style.display = "flex"; background.style.justifyContent = "center"; background.style.alignItems = "center"; background.style.flexDirection = "column"
        background.style.zIndex = "10000"

        background.onclick = (e) => {
            e.stopPropagation()
        }

        return background
    }

    create_buttons(){
        const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła", "Nie zwróciłem/am uwagi"]
        const buttons = []
        descriptions.forEach((text, index) => {
            const button = document.createElement("button")
            const value = 5 - index
            button.innerText = `${value}.  ${text}`

            // CSS configuration of assessment button
            button.style.width = "30%"; button.style.padding = "1em 1.5em"; button.style.margin = "0.5em 0em";
            button.style.fontWeight = "bold"; button.style.fontSize = "1.5rem"
            button.style.border = "none"; button.style.textAlign = "left"
            button.style.borderRadius = "0.5em"; button.style.cursor = "pointer";
            button.style.color = "#222222";
            button.style.zIndex = "10001"
            

            button.onmouseenter = (e) => {
                e.target.style.backgroundColor = "#458df5"
                e.target.style.color = "whitesmoke"
            }
            button.onmouseleave = (e) => {
                e.target.style.backgroundColor = "white"
                e.target.style.color = "black"
            }
            button.onmousedown = (e) => {
                e.target.style.backgroundColor = "#1b75f7"
            }
            button.onmouseup = (e) => {
                e.target.style.backgroundColor = "#458df5"
            }


            // JS configuration of assessment button
            button.onclick = this.handle_button_click
            button.setAttribute("value", value.toString())
            button.setAttribute("description", text)
            
            buttons.push(button)
        })

        // Last button reconfiguration
        const btn = buttons[buttons.length-1]
        btn.setAttribute("value", "DID_NOT_PAY_ATTENTION")
        btn.innerText = descriptions[buttons.length-1]
        btn.style.marginTop = "20px"

        return buttons
    }

   

    async handle_button_click(e){
        document.getElementById("assessment-popup").style.display = "none"
        const value = e.target.getAttribute("value")
        const description = e.target.getAttribute("description")
        
        const data = {
            value: value,
            description: description,
            timestamp: get_local_datetime(new Date())
        }

        // Get assessments from chrome.storage first
        const assessments = (await chrome.storage.local.get([STORAGE_KEYS.ASSESSMENTS_TO_SAVE]))[STORAGE_KEYS.ASSESSMENTS_TO_SAVE]
        
        // Push new assessments
        for(const key in data){
            assessments[key].push(data[key])
        }

        // Set chrome.storage with updated assessments
        await chrome.storage.local.set({
            [STORAGE_KEYS.ASSESSMENTS_TO_SAVE]: assessments
        })
    }
}




