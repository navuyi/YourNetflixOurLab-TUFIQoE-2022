import { combineReducers } from "redux";
import setupReducer from "./setupReducer";
import subjectIDReducer from "./subjectIDReducer";

const rootReducer = combineReducers({
    subject_id: subjectIDReducer,
    setup: setupReducer
})


export type T_APP_STATE = ReturnType<typeof rootReducer>
export default rootReducer