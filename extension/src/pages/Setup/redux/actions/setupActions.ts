import { T_SETUP } from "../reducers/setupReducer"

export interface I_SET_SETUP_ACTION {
    readonly type: "SET_SETUP"
    key: keyof T_SETUP
    payload: any
}


export type T_SETUP_ACTIONS = I_SET_SETUP_ACTION