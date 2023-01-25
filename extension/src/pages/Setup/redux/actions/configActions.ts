import { T_CONFIG } from "../../../../config/types/data-structures.type";

export interface I_SET_CONFIG_ACTION {
    readonly type: "SET_CONFIG",
    payload: T_CONFIG
}

export type T_CONFIG_ACTIONS = I_SET_CONFIG_ACTION