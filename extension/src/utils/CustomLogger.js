import { get_local_datetime } from "./time_utils"


export class CustomLogger{
    constructor(prefix){
        this.prefix = prefix
        this.original_logger = console.log
    }

    log = (content) => {
        const prefix_date = `${this.prefix} | ${get_local_datetime(new Date())} |`
        this.original_logger(prefix_date, content)
    }
}