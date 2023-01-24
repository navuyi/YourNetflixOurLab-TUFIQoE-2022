export interface ISetNameAction {
    readonly type: 'SET_NAME'
    payload: string
}

export type NameActions = ISetNameAction