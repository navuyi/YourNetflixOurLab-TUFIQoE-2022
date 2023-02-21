import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { CustomLogger } from "../../../../utils/custom/CustomLogger"
import { post_assessment } from "../../../../utils/http_requests/post-assessment"
import { NetflixPlayerAPI } from "../../../../utils/netflix/NetflixPlayerAPI"
import { get_local_datetime } from "../../../../utils/time_utils"


export class AssessmentManager{
    private started : Date 
    private ended : Date

    private jitter_max : number
    private jitter_min : number

    private assessment_interval : number | undefined

    private logger : CustomLogger

    constructor() {
        
        this.started = new Date()
        this.ended = new Date()

        this.jitter_max = 25
        this.jitter_min = 15

        this.logger = new CustomLogger("[AssessmentManager]")
    }

    /**
     * Initialize method. Executed once after creating instance of the class.
    */
    public init = async () : Promise<void> => {
        await this.init_popup()
        await this.prepare_assessment_interval()

        if(this.assessment_interval!=null && this.assessment_interval <= 0){
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
    private schedule_assessment_panel = () : void => {
        if(this.assessment_interval){
            const jitter = this.calculate_jitter()
            this.logger.log(`Scheduling assessment in ${this.assessment_interval/1000} + jitter of ${jitter/1000}.`)
            setTimeout(() => {
                this.show_assessment_panel()
            }, this.assessment_interval + jitter)
        }
    }

    /**
     * Calculates jitter that will be added to the assessment_interval
     * Can be a negative or positive value
     * @returns {number}
     */
    private calculate_jitter = () : number => {
        const range = [-1, 1]
        const multiplier = range[Math.floor(Math.random()*range.length)]
        const seconds = Math.round(Math.random() * (this.jitter_max - this.jitter_min + 1) + this.jitter_min)

        return multiplier * 1000 * seconds
    }

    /**
     * Manipulates the assessment panel styling so that is becomes visible
    */
    private show_assessment_panel = () : void => {
        const popup = document.getElementById("assessment-popup") as HTMLElement
        if(popup != null){
            this.started = new Date()
            popup.style.display = "unset"
            NetflixPlayerAPI.pause_video()
        }
    }


    /**
     * Prepares assessment interval so that it can be used as an argument for setTimeout
     * @returns {Promise<void>}
    */
    private prepare_assessment_interval = async () : Promise<void> => {
        const settings = await ChromeStorage.get_experiment_settings()

        const interval = settings.config?.assessment_interval
        if(interval != null && typeof interval == 'number'){
            this.assessment_interval = interval*1000
            this.logger.log(`Configuration assessment interval OK: ${interval}s - ${this.assessment_interval}ms`)
        }
        else{
            this.logger.log(`Configuration assessment interval missing or incorrect. Using default value: ${settings.assessment_interval_ms}ms.`)
            this.assessment_interval = settings.assessment_interval_ms
        }
    }

    /**
     * Initializes the assessment popup element
     * @returns {Promise<unknown>}
     */
    private init_popup = async () : Promise<void> => {
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

            let interval : ReturnType<typeof setInterval> | undefined = undefined
            interval = setInterval(() => {
                try{
                    const video = document.getElementsByTagName("video")[0]
                    const video_div = video.parentElement
                    const canvas_element = document.querySelectorAll("[data-uia='video-canvas']")[0] as HTMLElement

                    if(video && video_div && canvas_element){
                        clearInterval(interval) // stop the retrying process
                        video_div.appendChild(popup)    // add popup to the DOM
                        canvas_element.style.willChange = "unset"  // make popup clickable
                        resolve()
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
    private create_background = () : HTMLElement => {
        const background = document.createElement("div")
        background.style.width = "100vw"; background.style.height = "100vh";
        background.style.position = "absolute"; background.style.left= "0"; background.style.top = "0";
        background.style.backgroundColor = "#221F1F";
        background.style.display = "flex"; background.style.justifyContent = "center"; background.style.alignItems = "center"; background.style.flexDirection = "column"
        background.style.zIndex = "11000"


        background.onclick = (e) => {
            e.stopPropagation()
        }

        return background
    }

    /**
     * Creates header HTML element
     * @returns {HTMLElement}
    */
    private create_header = () : HTMLElement => {
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
        const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła"]
        const buttons : HTMLButtonElement[] = []
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
            

            button.onmouseenter = (e:Event) => {
                const target = e.target as HTMLButtonElement
                target.style.backgroundColor = "#F39A9D"
                target.style.color = "white"
            }
            button.onmouseleave = (e) => {
                const target = e.target as HTMLButtonElement
                target.style.backgroundColor = "white"
                target.style.color = "black"
            }
            button.onmousedown = (e) => {
                const target = e.target as HTMLButtonElement
                target.style.backgroundColor = "#f17074"
            }
            button.onmouseup = (e) => {
                const target = e.target as HTMLButtonElement
                target.style.backgroundColor = "#F39A9D"
            }


            // JS configuration of assessment button
            button.onclick = this.handle_button_click.bind(this) // Essential binding (so that function sees attributes of the class)
            button.setAttribute("value", value.toString())
            button.setAttribute("description", text)
            
            buttons.push(button)
        })

        return buttons
    }

   
    /**
     * Function handling assessment button clicks.
     * Reads data - assessment value/description, assessment time and timestamps and sends them to backend server
     * @param {Event} e 
    */
    async handle_button_click(e:Event){
        this.ended = new Date()
        const target = e.target as HTMLButtonElement
        const popup = document.getElementById("assessment-popup")
        if(popup) popup.style.display = "none"
      
        const value = target.getAttribute("value")
        const description = target.getAttribute("description")

        await NetflixPlayerAPI.resume_video()
        const variables = await ChromeStorage.get_experiment_variables()

        const data = {
            video_id: variables.database_video_id,
            value: value,
            description: description,
            started: get_local_datetime(this.started),
            timestamp: get_local_datetime(new Date()),
            duration:  this.ended.getTime() - this.started.getTime()
        }
       

        // Schedule next assessment panel
        this.schedule_assessment_panel()
        
        /*await*/ post_assessment(data) // <-- not waiting for response
    }
}




