import { combineReducers } from "redux";
import countReducer from "./countReducer";
import nameReducer from "./nameReducer";

const rootReducer = combineReducers({
    count: countReducer,
    name: nameReducer
})


export type AppState = ReturnType<typeof rootReducer>
export default rootReducer