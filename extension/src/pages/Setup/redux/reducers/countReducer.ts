import { CountActions } from "../actions/countActions";

type CountState = {
    count: number;
}
const initialState: CountState = {
    count: 0,
}

const countReducer = (state: CountState = initialState, action: CountActions) => {
    switch(action.type) {
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1,
            }
        case 'INCREMENT':
            return {
                ...state,
                count: state.count + 1,
            }
        default:
            return state;
    }
}
export default countReducer;