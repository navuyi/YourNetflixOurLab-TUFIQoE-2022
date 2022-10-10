import { CustomLogger } from "../../../../utils/CustomLogger"
import { send_assessment } from "../../../../utils/http_requests/send_assessment"
import { get_local_datetime } from "../../../../utils/time_utils"
import { CONFIGURATION_KEYS, STORAGE_KEYS } from "../../../config"
import { ASSESSMENT_INTERVAL } from "../../../config"



export class AssessmentManager{
    constructor() {
        this.interval = undefined
        this.started = undefined
        this.ended = undefined

        this.jitter_max = 25
        this.jitter_min = 15

        this.logger = new CustomLogger("[AssessmentManager]")

        this.assessment_interval = undefined
    }

    /**
     * Initialize method. Executed once after creating instance of the class.
    */
    async init(){
        await this.init_popup()

        await this.prepare_assessment_interval()
        if(this.assessment_interval <= 0){
            this.logger.log(`Assessment interval set to ${this.assessment_interval}.`)
            this.logger.log(`Assessments are disabled`)
            return
        }

        // Schedule first assessment panel
        this.schedule_assessment_panel()
    }

    
    /**
     * Schedules new assessment panel to show up in time determined by
     * defined assessment interval and random jitter
    */
    schedule_assessment_panel(){
        const jitter = this.calculate_jitter()
        this.logger.log(`Scheduling assessment in ${this.assessment_interval/1000} + jitter of ${jitter/1000}.`)
        setTimeout(() => {
            this.show_assessment_panel()
        }, this.assessment_interval + jitter)
    }

    calculate_jitter(){
        const range = [-1, 1]
        const multiplier = range[Math.floor(Math.random()*range.length)]
        const seconds = Math.round(Math.random() * (this.jitter_max - this.jitter_min + 1) + this.jitter_min)

        return multiplier * 1000 * seconds
    }

    show_assessment_panel(){
        const popup = document.getElementById("assessment-popup")
        this.started = new Date()
        popup.style.display = "unset"
    }


    async prepare_assessment_interval(){
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const interval = configuration[CONFIGURATION_KEYS.ASSESSMENT_INTERVAL]
        if(interval != null && typeof(interval) == 'number'){
            this.assessment_interval = interval*1000
            this.logger.log(`Configuration assessment interval OK: ${interval}s - ${this.assessment_interval}ms`)
        }
        else{
            this.logger.log(`Configuration assessment interval missing or incorrect. Using default value: ${ASSESSMENT_INTERVAL}ms.`)
            this.assessment_interval = ASSESSMENT_INTERVAL
        }
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
                    this.logger.log("Could not append popup element to video player. Retrying...")
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
        background.style.backgroundColor = "#221F1F";
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
        //const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła", "Nie zwróciłem/am uwagi"]
        const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła"]
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
    /*
        const btn = buttons[buttons.length-1]
        btn.setAttribute("value", "DID_NOT_PAY_ATTENTION")
        btn.innerText = descriptions[buttons.length-1]
        btn.style.marginTop = "20px"
    */


        return buttons
    }

   
    /**
     * Function handling assessment button clicks.
     * Reads data - assessment value/description, assessment time and timestamps and sends them to backend server
     * @param {Event} e 
    */
    async handle_button_click(e){
        this.ended = new Date()
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

        // Schedule next assessment panel
        this.schedule_assessment_panel()
        
        /*await*/ send_assessment(data)
    }
}




