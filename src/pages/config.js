export const STATS_RECORD_INTERVAL_MS = 1000 //1000 <---
export const STATS_NONCLICKABLE = true
export const STATS_INVISIBLE = false


export const DATABASE_KEYS = {
    POSITION: "position",
    DURATION: "duration",

    VOLUME: "volume",
    SEGMENT_POSITION: "segment_position",

    PLAYER_STATE: "player_state",
    BUFFERING_STATE: "buffering_state",
    RENDERING_STATE: "rendering_state",


    PLAYING_BITRATE_AUDIO: "playing_bitrate_audio",
    PLAYING_BITRATE_VIDEO: "playing_bitrate_video",
    RESOLUTION: "resolution",

    PLAYING_VMAF: "playing_vmaf",
    BUFFERING_VMAF: "buffering_vmaf",

    BUFFERING_BITRATE_AUDIO: "buffering_bitrate_audio",
    BUFFERING_BITRATE_VIDEO: "buffering_bitrate_video",

    TOTAL_FRAMES: "total_frames",
    TOTAL_DROPPED_FRAMES: "total_dropped_frames",
    TOTAL_CORRUPTED_FRAMES: "total_corrupted_frames",

    FRAMERATE: "framerate",
    TIMESTAMP: "timestamp"
}
// DATABASE_KEYS and DATABASE_DEFAULT should match keys
export const DATABASE_DEFAULT = {
    [DATABASE_KEYS.POSITION]: [],
    [DATABASE_KEYS.DURATION]: [],

    [DATABASE_KEYS.VOLUME]: [],
    [DATABASE_KEYS.SEGMENT_POSITION]: [],

    [DATABASE_KEYS.PLAYER_STATE]: [],
    [DATABASE_KEYS.BUFFERING_STATE]: [],
    [DATABASE_KEYS.RENDERING_STATE]: [],

    [DATABASE_KEYS.PLAYING_BITRATE_AUDIO]: [],
    [DATABASE_KEYS.PLAYING_BITRATE_VIDEO]: [],
    [DATABASE_KEYS.RESOLUTION]: [],

    [DATABASE_KEYS.PLAYING_VMAF]: [],
    [DATABASE_KEYS.BUFFERING_VMAF]: [],

    [DATABASE_KEYS.BUFFERING_BITRATE_AUDIO]: [],
    [DATABASE_KEYS.BUFFERING_BITRATE_VIDEO]: [],

    [DATABASE_KEYS.TOTAL_FRAMES]: [],
    [DATABASE_KEYS.TOTAL_DROPPED_FRAMES]: [],
    [DATABASE_KEYS.TOTAL_CORRUPTED_FRAMES]: [],

    [DATABASE_KEYS.FRAMERATE]: [],
    [DATABASE_KEYS.TIMESTAMP]: [],
}

export const ARCHIVE_KEYS = {
    DATA: "data",
    TIMESTAMP: "timestamp"
}

export const ARCHIVE_DEFAULT = {
    [ARCHIVE_KEYS.DATA]: [],
    [ARCHIVE_KEYS.TIMESTAMP]: []
}



export const ASSESSMENTS_KEYS = {
    VALUE: "value",
    DESCRIPTION: "description",
    TIMESTAMP: "timestamp",
    STARTED: "started",
    DURATION: "duration"
}
export const ASSESSMENTS_DEFAULT = {
    [ASSESSMENTS_KEYS.VALUE]: [],
    [ASSESSMENTS_KEYS.DESCRIPTION]: [],
    [ASSESSMENTS_KEYS.TIMESTAMP]: [],
    [ASSESSMENTS_KEYS.STARTED]: [],
    [ASSESSMENTS_KEYS.DURATION]: []
}

export const STORAGE_KEYS = {
    DATA_TO_SAVE: "data_to_save",
    ARCHIVE_TO_SAVE: "archive_to_save",
    ASSESSMENTS_TO_SAVE: "assessments_to_save",

    CURRENT_BANDWIDTH: "current_bandwidth",

    DEVICE_ID: "device_id",
    TESTER_ID: "tester_id",
    PAIR_ID: "pair_id",

    SESSION_TYPE: "session_type",
    EPISODE_COUNT: "episode_count",
    EPISODES_LIMIT: "episodes_limit",

    EPISODES_URL: "episodes_url"
}

export const STORAGE_DEFAULT = {
    [STORAGE_KEYS.DATA_TO_SAVE]: DATABASE_DEFAULT,
    [STORAGE_KEYS.ARCHIVE_TO_SAVE]: ARCHIVE_DEFAULT,
    [STORAGE_KEYS.ASSESSMENTS_TO_SAVE]: ASSESSMENTS_DEFAULT,

    [STORAGE_KEYS.EPISODE_COUNT]: 0,
    [STORAGE_KEYS.CURRENT_BANDWIDTH]: null,

    [STORAGE_KEYS.DEVICE_ID]: 106,                // 106 or 107 is correct, 106 set by default,
    [STORAGE_KEYS.TESTER_ID]: "123",                // tester's ID

    [STORAGE_KEYS.SESSION_TYPE]: "alone",       // alone and together are correct values, alone by default
    [STORAGE_KEYS.EPISODES_LIMIT]: 1,          // Most likely it will be set to 1 or 2

    [STORAGE_KEYS.EPISODES_URL]: [
        "https://www.netflix.com/watch/80025316?trackId=14170289&tctx=1%2C0%2Ce686a090-656c-4b05-8246-72e28d655c28-771746%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_2930186X3XX1651766627275%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_ROOT%2C%2C%2C",
        "https://www.netflix.com/watch/80025317?trackId=14170289&tctx=1%2C0%2Ce686a090-656c-4b05-8246-72e28d655c28-771746%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_2930186X3XX1651766627275%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_ROOT%2C%2C%2C",
        "https://www.netflix.com/watch/80025318?trackId=14170289&tctx=1%2C0%2Ce686a090-656c-4b05-8246-72e28d655c28-771746%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_2930186X3XX1651766627275%2C0a0d6676-6f4f-4a03-9ddd-7e955392b675_ROOT%2C%2C%2C"
    ]

    //[STORAGE_KEYS.SESSION_INDEX]: 0,            // Session index is responsible for tracking sessions iterations, DEFAULTS TO 0
}






export const MESSAGE_TEMPLATE = {
    HEADER: "header",
    DATA: "data",
    ARCHIVE: "archive"
}

export const MESSAGE_HEADERS = {
    START_ANALYZING: "start_analyzing",
    NERD_STATISTICS: "nerdstats",
    ASSESSMENT: "assessment",
    FINISHED: "finished",
    CREDITS: "credits"
}

/*
    Format of the content scripts <--> background scripts messages
    msg = {
        header: "message_header", eg. nerdstats
        payload: "the_actual_message_data"
    }
*/




