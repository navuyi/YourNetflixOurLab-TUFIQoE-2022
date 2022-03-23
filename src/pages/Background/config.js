

export const STORAGE_KEYS = {
        DEVICE_ID: "device_id",
        TESTER_ONE_ID: "tester_one_id",
        TESTER_TWO_ID: "tester_two_id",
        PAIR_ID: "pair_id",

        SESSION_TYPE: "session_type",
        EPISODES_AMOUNT: "episodes_amount"
}


export const DEFAULT_STORAGE = {
    [STORAGE_KEYS.DEVICE_ID]: 1,                    // 1 or 2 is correct, 1 set by default,
    [STORAGE_KEYS.TESTER_ONE_ID]: "123",          // first tester's phone number
    [STORAGE_KEYS.TESTER_TWO_ID]: "456",         // second tester's phone number
    [STORAGE_KEYS.PAIR_ID]: "",                      // Auto filled based on tester one and two ids

    [STORAGE_KEYS.SESSION_TYPE]: "alone",    // alone and together are correct values, alone by default
    [STORAGE_KEYS.EPISODES_AMOUNT]: 1    // Most likely it will be set to 1 or 2
}
