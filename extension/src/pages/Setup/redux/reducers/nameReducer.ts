import { NameActions } from "../actions/nameActions"

type NameState = {
    name: string
}

const initialState: NameState = {
    name : ""
}

const nameReducer = (state:NameState = initialState, actions:NameActions) => {
    switch(actions.type){
        case 'SET_NAME':
            return{
                ...state,
                name: actions.payload
            }
        default: 
            return state
    }
}

export default nameReducer