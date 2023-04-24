import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { T_SETUP_ACTIONS } from "../redux/actions/setupActions"
import { Dispatch } from "redux"
import { T_EXPERIMENT_SETTINGS } from "../../../config/storage.config"



export const useSetup = () => {
    const dispatch = useDispatch<Dispatch<T_SETUP_ACTIONS>>()

    const validateMappingAvailable = (urls : Array<string>) => {
        const valid = urls.every(url => /https:\/\/www.netflix.com\/watch\/[0-9]+.+/gm.test(url) === true) && urls.length > 0
        dispatch({
            type: "SET_SETUP", key: "mappingAvailable", payload: valid
        })
    }

    const validateExperimentAvailable = (settings : T_EXPERIMENT_SETTINGS) => {
        const non_empty = settings.videos.length > 0
        if(non_empty === false){
            dispatch({type:"SET_SETUP", key: "experimentAvailable", payload: false})
            return
        }
        const complete = settings.videos.some(video => video.scenario != null && video.bitrate_vmaf_map != null)
        
        dispatch({
            type:"SET_SETUP", key: "experimentAvailable", payload: non_empty && complete
        })
    }

    return{
        validateMappingAvailable,
        validateExperimentAvailable
    }
}


