export class AssessmentManager{
    constructor() {
        this.interval = undefined
    }


    async init(){
        setTimeout(() => {
            this.init_popup()
        }, 6000)
        //TODO delete this timeout when init_popup is made a promise
    }



   init_popup(){
        const popup = document.createElement("div")
        const background = this.create_background()
        const buttons = this.create_buttons()

       buttons.forEach(btn => {
           background.appendChild(btn)
       })

        popup.id = "assessment-popup"
        popup.style.zIndex = "10000"
        popup.appendChild(background)

       //TODO Make it promise to wait for the video to be available, html elements are loading
       document.getElementsByTagName("video")[0].parentElement.appendChild(popup)
   }

    create_background(){
        const background = document.createElement("div")
        background.style.width = "100vw"; background.style.height = "100vh";
        background.style.position = "absolute"; background.style.left= "0"; background.style.top = "0";
        background.style.backgroundColor = "#222222";
        background.style.opacity = "0.8";
        background.style.display = "flex"; background.style.justifyContent = "center"; background.style.alignItems = "center"; background.style.flexDirection = "column"


        return background
    }

    create_buttons(){
        const descriptions = ["Doskonała", "Dobra", "Przeciętna", "Niska", "Zła"]
        const buttons = []
        descriptions.forEach((text, index) => {
            const button = document.createElement("button")
            button.innerText = `${5-index} ${text}`

            button.style.width = "60%"; button.style.padding = "1em 1.5em"; button.style.margin = "0.5em 0em";
            button.style.fontWeight = "bold"; button.style.fontSize = "1.5rem"
            button.style.border = "none"; button.style.textAlign = "left"
            button.style.borderRadius = "0.5em"; button.style.cursor = "pointer";

            buttons.push(button)
        })
        console.log(buttons)
        return buttons
    }
}




