import { T_CONFIG } from "../../../../config/types/data-structures.type";
import { T_CONFIG_ACTIONS } from "../actions/configActions";




const initialState : T_CONFIG | null = null

const configReducer = (state:T_CONFIG|null = initialState, actions:T_CONFIG_ACTIONS) => {
    switch(actions.type){
        case "SET_CONFIG":
            return actions.payload
        default:
            return state
    }
}

export default configReducer