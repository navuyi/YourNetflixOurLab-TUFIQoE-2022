import { T_VIDEO } from "./types/data-structures.type"


export type T_EXPERIMENT_SETTINGS = {
    stats_record_interval_ms: number,
    bitrate_interval_ms: number,
    assessment_interval_ms: number,
    
    stats_nonclickable: boolean
    stats_invisible: boolean

    urls: Array<string>
    videos: Array<T_VIDEO>
}

export type T_EXPERIMENT_VARIABLES = {
    database_experiment_id: number,
    database_video_id: number,
    subject_id: number | string,
    extension_running : boolean,
    extension_mode: string,
    video_index: number
}

export type T_STORAGE = {
    experiment_settings: T_EXPERIMENT_SETTINGS,
    experiment_variables: T_EXPERIMENT_VARIABLES
}

export const STORAGE_DEFAULT : T_STORAGE = {
    experiment_settings: {
        stats_record_interval_ms: 1 * 1000, // default 1s=1000ms
        stats_nonclickable: true,
        stats_invisible: false,
        bitrate_interval_ms: 2.5 * 60 * 1000, // default 2.5min=150sec=150*1000
        assessment_interval_ms: 2.5 * 60 * 1000, // default 2.5min=150sec=150*1000
        urls: ["https://www.netflix.com/watch/70069631?trackId=14170286", "https://www.netflix.com/watch/70196274?trackId=255824129"],
        videos: []
    },
    experiment_variables: {
        database_experiment_id: -1,
        database_video_id: -1,
        subject_id: "",
        extension_running: false,
        extension_mode: "", // main or mapping
        video_index: 0
    }
}