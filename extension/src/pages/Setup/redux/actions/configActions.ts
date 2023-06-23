import { T_CONFIG } from "../../../../config/types/data-structures.type";

export interface I_SET_VALUE_ACTION {
    readonly type: "SET_VALUE",
    payload: T_CONFIG | null
}
export interface I_SET_EXPERIMENT_APPLICABLE_ACTION {
    readonly type: "SET_EXPERIMENT_APPLICABLE",
    payload: boolean
}

export interface I_SET_MAPPING_APPLICABLE_ACTION {
    readonly type: "SET_MAPPING_APPLICABLE",
    payload: boolean
}

export type T_CONFIG_ACTIONS = I_SET_VALUE_ACTION | I_SET_EXPERIMENT_APPLICABLE_ACTION | I_SET_MAPPING_APPLICABLE_ACTION