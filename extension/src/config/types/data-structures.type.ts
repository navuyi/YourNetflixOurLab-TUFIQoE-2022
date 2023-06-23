export type T_VMAF_TEMPLATE_ITEM = number
export type T_SCENARIO_ITEM = {
    bitrate: number,
    vmaf: number,
    vmaf_diff: number,
    vmaf_template: number
}
export type T_BITRATE_VMAF_MAP_ITEM = {
    bitrate: number,
    vmaf: number
}

export type T_VIDEO = {
    name: string,
    description: string,
    url: string,
    vmaf_template_scenario: Array<T_VMAF_TEMPLATE_ITEM>,
    bitrate_vmaf_map?: Array<T_BITRATE_VMAF_MAP_ITEM>
    scenario?: Array<T_SCENARIO_ITEM>
}

export type T_CONFIG = {
    title: string,
    description: string,
    assessment_interval: number,
    bitrate_interval: number,
    videos: Array<T_VIDEO>
}




export type T_DEBUG_DATA_PROCESSED = {
    position: string | null,
    duration: string | null,
    volume: string | null,
    segment_position: string | null,
    
    player_state: string | null,
    buffering_state: string | null,
    rendering_state: string | null,

    playing_bitrate_audio: string | null,
    playing_bitrate_video: string | null,
    resolution: string | null,

    playing_vmaf: string | null,
    buffering_vmaf: string | null,

    buffering_bitrate_audio: string | null,
    buffering_bitrate_video: string | null,

    total_frames: string | null,
    total_dropped_frames: string | null,
    total_corrupted_frames: string | null,

    framerate: string | null,
    timestamp: string | null
}

export type T_DEBUG_DATA_RAW = {
    data: string | null,
    timestamp: string
}

export type T_BITRATE_MENU_ELEMENTS = {
    container: HTMLElement,
    override_button: HTMLButtonElement,
    reset_button: HTMLButtonElement,
    select: HTMLSelectElement,
    options: Array<HTMLOptionElement>,
    bitrate_values: Array<number>
}
