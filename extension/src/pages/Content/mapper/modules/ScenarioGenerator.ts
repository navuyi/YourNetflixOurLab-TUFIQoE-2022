import { T_BITRATE_VMAF_MAP_ITEM, T_SCENARIO_ITEM, T_VIDEO } from "../../../../config/types/data-structures.type"
import { CustomLogger } from "../../../../utils/custom/CustomLogger"




export class ScenarioGenerator{
    private static logger : CustomLogger = new CustomLogger("[ScenarioGenerator]")
    
    public static generate_video_scenario = (video : T_VIDEO) : T_SCENARIO_ITEM[] => {
        // Initialize video scenario array
        const scenario : T_SCENARIO_ITEM[] = []
        console.log(video)
        const bitrate_vmaf_map = video.bitrate_vmaf_map
       
        for(const vmaf_template of video.vmaf_template_scenario){
            const {bitrate, vmaf} = this.find_closest_match(vmaf_template, bitrate_vmaf_map!)
            
            const scenario_item = {
                bitrate: bitrate,
                vmaf: vmaf,
                vmaf_template: vmaf_template,
                vmaf_diff: Math.abs(vmaf-vmaf_template)
            }
           scenario.push(scenario_item)
        }
        return scenario
    }


    public static find_closest_match = (expected_vmaf: number, bitrate_vmaf_map:T_BITRATE_VMAF_MAP_ITEM[]) : T_BITRATE_VMAF_MAP_ITEM => {
        // Sorts bitrate_vmaf_map based on difference from expected_vmaf - if expected value is in middle eg. 45 |50| 60 -> 40 will be choosen
        const closest_match = bitrate_vmaf_map.sort((a,b) => {
            return Math.abs(a.vmaf-expected_vmaf) - Math.abs(b.vmaf-expected_vmaf)
        })[0]
        
        return closest_match
    }
    
}




