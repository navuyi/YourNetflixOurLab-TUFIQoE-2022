export interface I_SET_SUBJECT_ID_ACTION {
    readonly type: 'SET_ID'
    payload: string
}

export type T_SUBJECT_ID_ACTIONS = I_SET_SUBJECT_ID_ACTION