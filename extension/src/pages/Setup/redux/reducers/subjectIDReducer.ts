import { T_SUBJECT_ID_ACTIONS } from "../actions/subjectIDActions"

type T_SUBJECT_ID = string
const initialState : T_SUBJECT_ID = ""

const subjectIDReducer = (state:T_SUBJECT_ID = initialState, actions:T_SUBJECT_ID_ACTIONS) => {

    switch(actions.type){
        case 'SET_ID':
            return actions.payload
        default: 
            return state
    }
}

export default subjectIDReducer