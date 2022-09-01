import get_bitrate_menu_elements from "../../utils/get_bitrate_menu_elements"
import { get_statistics_element } from "../../utils/get_statistics_element"

class Mapper{
    constructor(){
        this.interval = undefined
        this.available_bitrates = []
        this.max_bitrate_index = undefined
        this.nerdstat_element = undefined
        this.current_bitrate_index = 0
        this.vmaf_bitrate_map = []
    }

    print(text){
        console.log(`[StatsAnalyzer] ${text}`)
    }



    async init(){
        // Get available bitrate values
        this.available_bitrates = await this.get_available_bitrates()
        this.max_bitrate_index = this.available_bitrates.length - 1

        // Get nerd statistics element
        this.nerdstat_element = await get_statistics_element()

        this.print(`Available bitrates: ${this.available_bitrates}`)
        this.print(`Max bitrate index: ${this.max_bitrate_index}`)

        await this.start_mapping()
    }

    async get_available_bitrates(){
        const {bitrate_values, reset_button} = await get_bitrate_menu_elements()
        try{
            reset_button.click()
            this.print(`Bitrate menu closed (reset_button)`)
        }
        catch{
            this.print(`reset_button could not be clicked`)
        }
        return bitrate_values
    }

    async start_mapping(){
        const current_bitrate = this.available_bitrates[this.current_bitrate_index]

        const {select, override_button} = await get_bitrate_menu_elements()
        this.set_bitrate(select,override_button, current_bitrate)
        const map_item = await this.wait_for_change(current_bitrate)

        this.vmaf_bitrate_map.push(map_item)

        console.log(this.vmaf_bitrate_map)
        
        this.print(`Incrementing current_bitrate_index`)
        this.current_bitrate_index += 1
        this.print(`Current bitrate index: ${this.current_bitrate_index}`)

        if(this.current_bitrate_index <= this.max_bitrate_index){
            this.start_mapping()
        }
        else{

        }
        
    }


    async set_bitrate(select, override_button, bitrate){
        select.value = bitrate
        override_button.click()  // <-- the change happens after click event is dispatched
    }

    async wait_for_change(expected_bitrate){
        return new Promise(resolve => {
            let interval;
            interval = setInterval(async ()=>{
                const {buffering_bitrate, buffering_vmaf} = await this.get_buffering_data(this.nerdstat_element.value.toString())
                this.print(`Expected bitrate: ${expected_bitrate}`)
                this.print(`Buffering bitrate: ${buffering_bitrate}`)
                if(expected_bitrate == buffering_bitrate){
                    this.print(`Found vmaf<->bitrate mapping. Resolving...`)
                    clearInterval(interval)
                    const map_item = {
                        bitrate: expected_bitrate,
                        vmaf_available: buffering_vmaf
                    }
                    resolve(map_item)
                }
            }, 1000)
        })
    }

    async get_buffering_data(data){        
        const buffering_bitrate = this.get_value("Buffering bitrate \\(a\\/v\\):\\s*([0-9]+)\\s*\\/\\s*([0-9]+)", 2, data)
        const buffering_vmaf = this.get_value("Playing\/Buffering vmaf: ([0-9]+)\s*\/\s*([0-9]+)", 2, data)

        return {buffering_bitrate, buffering_vmaf}
    }
    
    get_value = (regex, group, data) => {
        try{
            let value = data.match(regex) ?? null
            if(value != null){
                return value[group]
            }
            else{
                return null
            }
        }
        catch(e){
            console.log(e)
            return null
        }
    }
}



export default Mapper