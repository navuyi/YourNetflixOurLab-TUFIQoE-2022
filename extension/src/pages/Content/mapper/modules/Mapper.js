import { invoke_bitrate_menu_and_get_html_elements } from "../../utils/get_bitrate_menu_elements"
import { get_statistics_element } from "../../utils/get_statistics_element"
import { BitrateMenu } from "../../utils/BitrateMenu"


class Mapper{
    constructor(){
        this.interval = undefined
        this.available_bitrates = []
        this.max_bitrate_index = undefined
        this.nerdstat_element = undefined
        this.current_bitrate_index = 0
        this.vmaf_bitrate_map = []

        // BitrateMenu class instance
        this.bitrate_menu = undefined
    }

    print(text){
        console.log(`[StatsAnalyzer] ${text}`)
    }


    async init(){
        // Init BitrateMenu instance
        this.bitrate_menu = new BitrateMenu()
        await this.bitrate_menu.init()

        // Get available bitrate values
        this.available_bitrates = this.bitrate_menu.get_available_bitrates()
        this.max_bitrate_index = this.available_bitrates.length - 1

        // Get nerd statistics element
        this.nerdstat_element = await get_statistics_element()

        this.print(`Available bitrates: ${this.available_bitrates}`)
        this.print(`Max bitrate index: ${this.max_bitrate_index}`)

        await this.map_bitrate_to_vmaf()
    }

   

    async map_bitrate_to_vmaf(){
        // Define bitrate to me mapped
        const bitrate_to_map = this.available_bitrates[this.current_bitrate_index]

        // Invoke bitrate menu
        await this.bitrate_menu.invoke_bitrate_menu()
        // Set next bitrate to be mapped
        this.bitrate_menu.set_bitrate(bitrate_to_map)

        // Wait for buffering bitrate and vmaf to change
        const map_item = await this.wait_for_change(bitrate_to_map)

        this.vmaf_bitrate_map.push(map_item)

        console.log(this.vmaf_bitrate_map)
        
        this.current_bitrate_index += 1

        if(this.current_bitrate_index <= this.max_bitrate_index){
            this.map_bitrate_to_vmaf()
        }
        else{
            this.print(`Bitrate to vmaf mapping finished.`)
            console.log(this.vmaf_bitrate_map)
        }
    }



    async wait_for_change(expected_bitrate){
        return new Promise(resolve => {
            let interval;
            interval = setInterval(async ()=>{
                const {buffering_bitrate, buffering_vmaf} = await this.get_buffering_data(this.nerdstat_element.value.toString())
                this.print(`Expected bitrate: ${expected_bitrate}`)
                this.print(`Buffering bitrate: ${buffering_bitrate}`)
                if(parseInt(expected_bitrate) === parseInt(buffering_bitrate)){
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