/*DROP TABLES*/
DROP TABLE IF EXISTS bitrate;
DROP TABLE IF EXISTS experiment;
DROP TABLE IF EXISTS video;
DROP TABLE IF EXISTS playback_data;
DROP TABLE IF EXISTS assessment;


CREATE TABLE IF NOT EXISTS experiment(
    id INTEGER NOT NULL PRIMARY KEY,
    
    started TEXT NOT NULL,
    ended TEXT DEFAUL NULL,
    
    device_id TEXT NOT NULL,        /* 106 or 107 */
    experiment_type TEXT NOT NULL,  /* alone or together */
    video_limit INTEGER NOT NULL,
    tester_id TEXT NOT NULL,
    urls TEXT NOT NULL        /*stringified json array with urls*/
);


CREATE TABLE IF NOT EXISTS bitrate(
    id INTEGER NOT NULL PRIMARY KEY,
    video_id INTEGER NOT NULL,
    value INTEGER NOT NULL,     /*new bitrate value*/
    previous INTEGER NOT NULL,  /*previus bitrate value*/
    timestamp TEXT NOT NULL,

    FOREIGN KEY(video_id) REFERENCES video(id)
);


CREATE TABLE IF NOT EXISTS video(
    id INTEGER NOT NULL PRIMARY KEY,
    
    started TEXT NOT NULL,  
    ended TEXT DEFAUL NULL,    

    experiment_id INTEGER NOT NULL,
    video_index INTEGER NOT NULL,
    url TEXT NOT NULL,

    FOREIGN KEY(experiment_id) REFERENCES experiment(id)
);


CREATE TABLE IF NOT EXISTS playback_data(
    id INTEGER NOT NULL PRIMARY KEY,
    video_id INTEGER NOT NULL,

    buffering_bitrate_audio TEXT,
    buffering_bitrate_video TEXT,
    buffering_state TEXT,
    buffering_vmaf TEXT,
    duration TEXT,
    framerate TEXT,
    player_state TEXT,
    playing_bitrate_video TEXT,
    playing_bitrate_audio TEXT,
    playing_vmaf TEXT,
    position TEXT,
    rendering_state TEXT,
    resolution TEXT,
    segment_position TEXT,
    timestamp TEXT,
    total_corrupted_frames TEXT,
    total_dropped_frames TEXT,
    total_frames TEXT,
    volume TEXT,
    bitrate TEXT,

    FOREIGN KEY(video_id) REFERENCES video(id)
);

CREATE TABLE IF NOT EXISTS assessment(
    id INTEGER NOT NULL PRIMARY KEY,
    video_id INTEGER NOT NULL,

    value INTEGER NO NULL,
    description TEXT NOT NULL,
    started TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    duration REAL NOT NULL,

    FOREIGN KEY(video_id) REFERENCES video(id)
);