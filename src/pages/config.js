

export const STORAGE_KEYS = {
        DEVICE_ID: "device_id",
        TESTER_ONE_ID: "tester_one_id",
        TESTER_TWO_ID: "tester_two_id",
        PAIR_ID: "pair_id",

        SESSION_TYPE: "session_type",
        EPISODES_AMOUNT: "episodes_amount",


        SESSION_INDEX: "session_index"
}


export const DEFAULT_STORAGE = {
    [STORAGE_KEYS.DEVICE_ID]: 1,                // 1 or 2 is correct, 1 set by default,
    [STORAGE_KEYS.TESTER_ONE_ID]: "123",        // first tester's phone number
    [STORAGE_KEYS.TESTER_TWO_ID]: "456",        // second tester's phone number
    [STORAGE_KEYS.PAIR_ID]: "",                 // Auto filled based on tester one and two ids

    [STORAGE_KEYS.SESSION_TYPE]: "alone",       // alone and together are correct values, alone by default
    [STORAGE_KEYS.EPISODES_AMOUNT]: 1,          // Most likely it will be set to 1 or 2

    
    [STORAGE_KEYS.SESSION_INDEX]: 0,            // Session index is responsible for tracking sessions iterations, DEFAULTS TO 0
}



export const STATS_RECORD_INTERVAL_MS = 1000

export const STATS_UNCLICKABLE = true
export const STATS_INVISIBLE = true

export const MESSAGE_FORMAT = {
    HEADER: "header",
    DATA: "data"
}

export const MESSAGE_HEADERS = {
    NERD_STATISTICS: "nerdstats",
    ASSESSMENT: "assessment"
}

/*
    Format of the content scripts <--> background scripts messages
    msg = {
        header: "message_header", eg. nerdstats
        payload: "the_actual_message_data"
    }
*/