import { get_local_datetime } from "../time_utils"


export class CustomLogger{
    private prefix : string
    private original_logger: Function
    private color : string

    constructor(prefix : string, color : string = "white"){
        this.prefix = prefix
        this.color = color
        this.original_logger = console.log
    }

    public log = (content : any) : void => {
        const prefix = `${this.prefix} | ${get_local_datetime(new Date())} |`
        this.original_logger(`${prefix} %c ${content}`, `color: ${this.color}`)
    }
}