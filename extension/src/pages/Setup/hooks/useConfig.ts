import { useSelector } from "react-redux"
import { T_APP_STATE } from "../redux/reducers"
import { ChromeStorage } from "../../../utils/custom/ChromeStorage"
import { T_CONFIG } from "../../../config/types/data-structures.type"
import { useDispatch } from "react-redux"
import { Dispatch } from "redux"
import { T_CONFIG_ACTIONS } from "../redux/actions/configActions"



export const useConfig = () => {
    const config = useSelector((state:T_APP_STATE) => state.config)
    const configDispatch = useDispatch<Dispatch<T_CONFIG_ACTIONS>>()

    const load_config = async () => {
        // update state

        // update storage
        const settings = await ChromeStorage.get_experiment_settings()
        //settings.config...
    }

    const is_config_mapping_compatible = async (config : object) : Promise<boolean> => {
        //TODO - finish validation function for checking if provided config is applicable for bitrate-vmaf mapping
        

        return true
    }


    //TODO - finish config validation - to be used before starting the experiment
    const is_config_complete = async () : Promise<boolean> => {
        const {config} = await ChromeStorage.get_experiment_settings()

        if(typeof config !== "object") return false
        if(config === null || config === undefined) return false
        if("videos" in config === false) return false
        
        for(const video of config.videos){
            // Check video scenario
            if(video.scenario === null || video.scenario === undefined) return false
            if(video.scenario.length === 0) return false

            // Check bitrate-vmaf map
            if(video.bitrate_vmaf_map === null || video.bitrate_vmaf_map === undefined) return false
            if(video.bitrate_vmaf_map.every(item => typeof item.bitrate === "number" && typeof item.vmaf === "number") === false) return false
        }

        // And finally...
        return true
    }


    return {
        load_config,
        is_config_complete
    }
}