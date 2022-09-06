import { CustomLogger } from "../../../../utils/CustomLogger"
import { send_assessment } from "../../../../utils/http_requests/send_assessment"
import { get_local_datetime } from "../../../../utils/time_utils"
import { STORAGE_KEYS } from "../../../config"
import { ASSESSMENT_INTERVAL } from "../../../config"



export class AssessmentManager{
    constructor() {
        this.interval = undefined
        this.started = undefined
        this.ended = undefined
        this.panel_visible = false

        this.logger = new CustomLogger("[AssessmentManager]")
    }

    /**
     * Initialize method. Executed once after creating instance of the class.
    */
    async init(){
        await this.init_popup()
        this.start_assessment_process()
    }

    
    /**
     * Method starting assessment process.
     * It will show assessment to the subject in defined time intervals 
     * by setting it's style.display from "none" to "unset"
    */
    start_assessment_process(){
        this.interval = setInterval(() => {
            if(this.panel_visible === false){
                const popup = document.getElementById("assessment-popup")
                this.started = new Date()
                popup.style.display = "unset"
                this.panel_visible = true
            }
        }, ASSESSMENT_INTERVAL) 
    }

    

    async init_popup(){
        return new Promise(resolve => {
            const popup = document.createElement("div")
            const background = this.create_background()
            const buttons = this.create_buttons()
            const header = this.create_header()

            background.appendChild(header)
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

                    if(video && video_div && ltr_element){
                        clearInterval(interval) // stop the retrying process
                        video_div.appendChild(popup)    // add popup to the DOM
                        ltr_element.style.willChange = "unset"  // make popup clickable
                        resolve(true)
                    }
                }
                catch(err){
                    this.logger.log(err)
                }
            }, 500)
        })
    }

    

    /**
     * Creates background html element
     * @returns {HTMLElement}
    */
    create_background(){
        const background = document.createElement("div")
        background.style.width = "100vw"; background.style.height = "100vh";
        background.style.position = "absolute"; background.style.left= "0"; background.style.top = "0";
        background.style.backgroundColor = "#222222";
        background.style.opacity = "0.9";
        background.style.display = "flex"; background.style.justifyContent = "center"; background.style.alignItems = "center"; background.style.flexDirection = "column"
        background.style.zIndex = "10000"


        background.onclick = (e) => {
            e.stopPropagation()
        }

        return background
    }

    /**
     * Creates header HTML element
     * @returns {HTMLElement}
    */
    create_header(){
        const header = document.createElement("h1")
        header.innerText = "Oceń jakość usługi od strony audiowizualnej"
        header.style.color = "#F39A9D"
        header.style.fontSize = "3rem"
        header.style.zIndex = "10001"
        header.style.textAlign = "center"

        return header
    }

    /**
     * Creates and styles buttons and assigns them proper description and value
     * @returns {Array.HTMLElement}
     */
    create_buttons(){
        const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła", "Nie zwróciłem/am uwagi"]
        const buttons = []
        descriptions.forEach((text, index) => {
            const button = document.createElement("button")
            const value = 5 - index
            button.innerText = `${value}.  ${text}`

            // CSS configuration of assessment button
            button.style.width = "25%"; button.style.padding = "1em 1.5em"; button.style.margin = "0.5em 0em";
            button.style.fontWeight = "bolder"; button.style.fontSize = "1.5rem"
            button.style.border = "none"; button.style.textAlign = "left"
            button.style.borderRadius = "0.5em"; button.style.cursor = "pointer";
            button.style.color = "#222222";
            button.style.zIndex = "10001"
            

            button.onmouseenter = (e) => {
                e.target.style.backgroundColor = "#F39A9D"
                e.target.style.color = "white"
            }
            button.onmouseleave = (e) => {
                e.target.style.backgroundColor = "white"
                e.target.style.color = "black"
            }
            button.onmousedown = (e) => {
                e.target.style.backgroundColor = "#f17074"
            }
            button.onmouseup = (e) => {
                e.target.style.backgroundColor = "#F39A9D"
            }


            // JS configuration of assessment button
            button.onclick = this.handle_button_click.bind(this) // Essential binding (so that function sees attributes of the class)
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

   
    /**
     * Function handling assessment button clicks.
     * Reads data - assessment value/description, assessment time and timestamps and sends them to backend server
     * @param {Event} e 
    */
    async handle_button_click(e){
        this.ended = new Date()
        this.panel_visible = false
        document.getElementById("assessment-popup").style.display = "none"
        const value = e.target.getAttribute("value")
        const description = e.target.getAttribute("description")
        
        const data = {
            video_id: (await chrome.storage.local.get([STORAGE_KEYS.DATABASE_VIDEO_ID]))[STORAGE_KEYS.DATABASE_VIDEO_ID],
            value: value,
            description: description,
            started: get_local_datetime(this.started),
            timestamp: get_local_datetime(new Date()),
            duration: this.ended - this.started
        }
        
        /*await*/ send_assessment(data)
    }
}




