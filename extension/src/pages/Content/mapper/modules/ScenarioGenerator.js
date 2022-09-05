import { CONFIGURATION_KEYS } from "../../../config"



export class ScenarioGenerator{
    constructor(episode){
        this.episode = episode
        this.bitrate_vmaf_map = episode[CONFIGURATION_KEYS.BITRATE_VMAF_MAP]
        this.vmaf_template_scenario = episode[CONFIGURATION_KEYS.VMAF_TEMPLATE_SCENARIO]
        this.scenario = []
    }


    generate_episode_scenario(){
        for(const vmaf_template of this.vmaf_template_scenario){
           
            const {bitrate, vmaf} = this.find_closest_match(vmaf_template)
            
            const scenario_item = {
                bitrate: bitrate,
                vmaf: vmaf,
                vmaf_template: vmaf_template,
                vmaf_diff: Math.abs(vmaf-vmaf_template)
            }
            this.scenario.push(scenario_item)
        }

        return this.scenario
    }


    find_closest_match(vmaf_template){
        let closest_match;
        this.bitrate_vmaf_map.reduce((previous, current) => {
            return (Math.abs(current.vmaf - vmaf_template) < Math.abs(previous.vmaf - vmaf_template) ? closest_match=current : closest_match=previous)
        })

        return {
            bitrate: parseInt(closest_match.bitrate),
            vmaf: parseInt(closest_match.vmaf)
        }
    }
    
}




