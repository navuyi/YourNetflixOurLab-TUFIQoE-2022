import { combineReducers } from "redux";
import configReducer from "./configReducer";

import subjectIDReducer from "./subjectIDReducer";

const rootReducer = combineReducers({
    config: configReducer,
    subject_id: subjectIDReducer
})


export type T_APP_STATE = ReturnType<typeof rootReducer>
export default rootReducer