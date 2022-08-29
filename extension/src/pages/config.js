export const STATS_RECORD_INTERVAL_MS = 2000; //1000 <---
export const STATS_NONCLICKABLE = true;
export const STATS_INVISIBLE = false;
export const BITRATE_CHANGE_INTERVAL = 5 * 60 * 1000; // <--- 5 minutes = 5*60*1000
export const ASSESSMENT_INTERVAL = 2.5 * 60 * 1000; // <--- 2.5*60*1000

export const DATABASE_KEYS = {
  POSITION: 'position',
  DURATION: 'duration',

  VOLUME: 'volume',
  SEGMENT_POSITION: 'segment_position',

  PLAYER_STATE: 'player_state',
  BUFFERING_STATE: 'buffering_state',
  RENDERING_STATE: 'rendering_state',

  PLAYING_BITRATE_AUDIO: 'playing_bitrate_audio',
  PLAYING_BITRATE_VIDEO: 'playing_bitrate_video',
  RESOLUTION: 'resolution',

  PLAYING_VMAF: 'playing_vmaf',
  BUFFERING_VMAF: 'buffering_vmaf',

  BUFFERING_BITRATE_AUDIO: 'buffering_bitrate_audio',
  BUFFERING_BITRATE_VIDEO: 'buffering_bitrate_video',

  TOTAL_FRAMES: 'total_frames',
  TOTAL_DROPPED_FRAMES: 'total_dropped_frames',
  TOTAL_CORRUPTED_FRAMES: 'total_corrupted_frames',

  FRAMERATE: 'framerate',
  TIMESTAMP: 'timestamp',
};
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
};

export const ARCHIVE_KEYS = {
  DATA: 'data',
  TIMESTAMP: 'timestamp',
};

export const ARCHIVE_DEFAULT = {
  [ARCHIVE_KEYS.DATA]: [],
  [ARCHIVE_KEYS.TIMESTAMP]: [],
};

export const ASSESSMENTS_KEYS = {
  VALUE: 'value',
  DESCRIPTION: 'description',
  TIMESTAMP: 'timestamp',
  STARTED: 'started',
  DURATION: 'duration',
};
export const ASSESSMENTS_DEFAULT = {
  [ASSESSMENTS_KEYS.VALUE]: [],
  [ASSESSMENTS_KEYS.DESCRIPTION]: [],
  [ASSESSMENTS_KEYS.TIMESTAMP]: [],
  [ASSESSMENTS_KEYS.STARTED]: [],
  [ASSESSMENTS_KEYS.DURATION]: [],
};

export const STORAGE_KEYS = {
  DATA_TO_SAVE: 'data_to_save',
  ARCHIVE_TO_SAVE: 'archive_to_save',
  ASSESSMENTS_TO_SAVE: 'assessments_to_save',

  DATABASE_EXPERIMENT_ID: 'database_experiment_index',
  DATABASE_VIDEO_ID: 'database_video_index',

  CURRENT_BITRATE: 'current_bitrate',

  DEVICE_ID: 'device_id',
  TESTER_ID: 'tester_id',
  PAIR_ID: 'pair_id',

  EXPERIMENT_TYPE: 'experiment_type',
  VIDEO_COUNT: 'video_count',
  VIDEO_LIMIT: 'video_limit',

  VIDEO_URLS: 'video_urls',

  RUNNING: 'running',
  BITRATE_MODE: 'bitrate_mode',
};

export const STORAGE_DEFAULT = {
  [STORAGE_KEYS.DATA_TO_SAVE]: DATABASE_DEFAULT,
  [STORAGE_KEYS.ARCHIVE_TO_SAVE]: ARCHIVE_DEFAULT,
  [STORAGE_KEYS.ASSESSMENTS_TO_SAVE]: ASSESSMENTS_DEFAULT,

  [STORAGE_KEYS.DATABASE_EXPERIMENT_ID]: null,
  [STORAGE_KEYS.DATABASE_VIDEO_ID]: null,

  [STORAGE_KEYS.CURRENT_BITRATE]: null,

  [STORAGE_KEYS.VIDEO_COUNT]: 0,

  [STORAGE_KEYS.DEVICE_ID]: 106, // 106 or 107 is correct, 106 set by default,
  [STORAGE_KEYS.TESTER_ID]: '123', // tester's ID

  [STORAGE_KEYS.EXPERIMENT_TYPE]: 'alone', // alone and together are correct values, alone by default
  [STORAGE_KEYS.VIDEO_LIMIT]: 1, // Most likely it will be set to 1 or 2

  [STORAGE_KEYS.VIDEO_URLS]: [
    'https://www.netflix.com/watch/80025316?trackId=14170286',
  ],

  [STORAGE_KEYS.RUNNING]: false,
  [STORAGE_KEYS.BITRATE_MODE]: 'sequential', //<-- random or sequential are available || KEEP sequential as default ! ! !
};

export const MESSAGE_TEMPLATE = {
  HEADER: 'header',
  DATA: 'data',
  ARCHIVE: 'archive',
};

export const MESSAGE_HEADERS = {
  START_ANALYZING: 'start_analyzing',
  NERD_STATISTICS: 'nerdstats',
  ASSESSMENT: 'assessment',
  FINISHED: 'finished',
  CREDITS: 'credits',
};
