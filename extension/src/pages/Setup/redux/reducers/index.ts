import { combineReducers } from "redux";

import subjectIDReducer from "./subjectIDReducer";

const rootReducer = combineReducers({
    subject_id: subjectIDReducer
})


export type T_APP_STATE = ReturnType<typeof rootReducer>
export default rootReducer