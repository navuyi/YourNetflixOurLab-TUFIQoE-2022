import { T_SETUP_ACTIONS } from "../actions/setupActions";


export type T_SETUP = {
    urls: string[]
    mappingAvailable: boolean
    experimentAvailable: boolean
}

const initialState : T_SETUP = {
    urls: [],
    mappingAvailable: false,
    experimentAvailable: false
}

const setupReducer = (state: T_SETUP = initialState, actions: T_SETUP_ACTIONS) => {
    switch(actions.type){
        case 'SET_SETUP':
            const tmp = {...state}
            tmp[actions.key] = actions.payload
            return tmp
        default:
            return state
    }
}


export default setupReducer