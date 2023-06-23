import { T_CONFIG } from "../../../../config/types/data-structures.type";
import { T_CONFIG_ACTIONS } from "../actions/configActions";


type T_CONFIG_STATE = {
    value: T_CONFIG | null,
    experiment_applicable : boolean,
    mapping_applicable : boolean
} 

const initialState : T_CONFIG_STATE  = {
    value: null,
    experiment_applicable: false,
    mapping_applicable: false
}

const configReducer = (state:T_CONFIG_STATE = initialState, actions:T_CONFIG_ACTIONS) => {
    switch(actions.type){
        case "SET_VALUE":
            return{
                ...state,
                value: actions.payload
            }
        case "SET_EXPERIMENT_APPLICABLE":
            return{
                ...state,
                experiment_applicable: actions.payload
            }
        case "SET_MAPPING_APPLICABLE":
            return{
                ...state,
                mapping_applicable: actions.payload
            }
        default:
            return state
    }
}

export default configReducer