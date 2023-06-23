export class VideoCurtain{
    private id : string
    private inner_text : string
    private element : HTMLElement
    
    constructor(id : string, inner_text : string){
        this.id  = id
        this.inner_text = inner_text
        this.element = this.create_panel()
    }

    private create_panel = () : HTMLElement => {
        const panel = document.createElement("div") as HTMLElement
        panel.id = this.id

        // Styling
        panel.style.width = "100vw"
        panel.style.height = "100vh"
        panel.style.backgroundColor = "#222222"
        panel.style.position = "absolute"
        panel.style.left = "0px"; panel.style.top = "0px";

        panel.style.display = "flex"
        panel.style.justifyContent = "center"
        panel.style.alignItems = "center"

        panel.style.color = "white"
        panel.style.fontSize = "24px"

        panel.style.zIndex = "11000"
        panel.style.pointerEvents = "none"
        return panel
    }

    public reveal = () : void => {
        const video = document.getElementsByTagName("video")[0] as HTMLElement
        const video_div = video.parentElement as HTMLElement
        const video_canvas = document.querySelectorAll("[data-uia='video-canvas']")[0] as HTMLElement
        video_canvas.style.willChange = "unset"

        
        this.element.innerText = this.inner_text
        video_div.appendChild(this.element)
    }

    public remove = () : void => {
        this.element.remove()
    }
}