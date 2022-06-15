"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("testScript",{

/***/ "./src/pages/config.js":
/*!*****************************!*\
  !*** ./src/pages/config.js ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "STATS_RECORD_INTERVAL_MS": () => (/* binding */ STATS_RECORD_INTERVAL_MS),
/* harmony export */   "STATS_NONCLICKABLE": () => (/* binding */ STATS_NONCLICKABLE),
/* harmony export */   "STATS_INVISIBLE": () => (/* binding */ STATS_INVISIBLE),
/* harmony export */   "BITRATE_CHANGE_INTERVAL": () => (/* binding */ BITRATE_CHANGE_INTERVAL),
/* harmony export */   "ASSESSMENT_INTERVAL": () => (/* binding */ ASSESSMENT_INTERVAL),
/* harmony export */   "DATABASE_KEYS": () => (/* binding */ DATABASE_KEYS),
/* harmony export */   "DATABASE_DEFAULT": () => (/* binding */ DATABASE_DEFAULT),
/* harmony export */   "ARCHIVE_KEYS": () => (/* binding */ ARCHIVE_KEYS),
/* harmony export */   "ARCHIVE_DEFAULT": () => (/* binding */ ARCHIVE_DEFAULT),
/* harmony export */   "ASSESSMENTS_KEYS": () => (/* binding */ ASSESSMENTS_KEYS),
/* harmony export */   "ASSESSMENTS_DEFAULT": () => (/* binding */ ASSESSMENTS_DEFAULT),
/* harmony export */   "STORAGE_KEYS": () => (/* binding */ STORAGE_KEYS),
/* harmony export */   "STORAGE_DEFAULT": () => (/* binding */ STORAGE_DEFAULT),
/* harmony export */   "MESSAGE_TEMPLATE": () => (/* binding */ MESSAGE_TEMPLATE),
/* harmony export */   "MESSAGE_HEADERS": () => (/* binding */ MESSAGE_HEADERS)
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

const STATS_RECORD_INTERVAL_MS = 1000; //1000 <---

const STATS_NONCLICKABLE = true;
const STATS_INVISIBLE = false;
const BITRATE_CHANGE_INTERVAL = 10 * 60 * 1000; // <--- 5 minutes = 5*60*1000

const ASSESSMENT_INTERVAL = 5000; // <--- 2.5*60*1000

const DATABASE_KEYS = {
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
}; // DATABASE_KEYS and DATABASE_DEFAULT should match keys

const DATABASE_DEFAULT = {
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
  [DATABASE_KEYS.TIMESTAMP]: []
};
const ARCHIVE_KEYS = {
  DATA: "data",
  TIMESTAMP: "timestamp"
};
const ARCHIVE_DEFAULT = {
  [ARCHIVE_KEYS.DATA]: [],
  [ARCHIVE_KEYS.TIMESTAMP]: []
};
const ASSESSMENTS_KEYS = {
  VALUE: "value",
  DESCRIPTION: "description",
  TIMESTAMP: "timestamp",
  STARTED: "started",
  DURATION: "duration"
};
const ASSESSMENTS_DEFAULT = {
  [ASSESSMENTS_KEYS.VALUE]: [],
  [ASSESSMENTS_KEYS.DESCRIPTION]: [],
  [ASSESSMENTS_KEYS.TIMESTAMP]: [],
  [ASSESSMENTS_KEYS.STARTED]: [],
  [ASSESSMENTS_KEYS.DURATION]: []
};
const STORAGE_KEYS = {
  DATA_TO_SAVE: "data_to_save",
  ARCHIVE_TO_SAVE: "archive_to_save",
  ASSESSMENTS_TO_SAVE: "assessments_to_save",
  DATABASE_EXPERIMENT_ID: "database_experiment_index",
  DATABASE_VIDEO_ID: "database_video_index",
  CURRENT_BITRATE: "current_bitrate",
  DEVICE_ID: "device_id",
  TESTER_ID: "tester_id",
  PAIR_ID: "pair_id",
  EXPERIMENT_TYPE: "experiment_type",
  VIDEO_COUNT: "video_count",
  VIDEO_LIMIT: "video_limit",
  VIDEO_URLS: "video_urls",
  RUNNING: "running"
};
const STORAGE_DEFAULT = {
  [STORAGE_KEYS.DATA_TO_SAVE]: DATABASE_DEFAULT,
  [STORAGE_KEYS.ARCHIVE_TO_SAVE]: ARCHIVE_DEFAULT,
  [STORAGE_KEYS.ASSESSMENTS_TO_SAVE]: ASSESSMENTS_DEFAULT,
  [STORAGE_KEYS.DATABASE_EXPERIMENT_ID]: null,
  [STORAGE_KEYS.DATABASE_VIDEO_ID]: null,
  [STORAGE_KEYS.CURRENT_BITRATE]: null,
  [STORAGE_KEYS.VIDEO_COUNT]: 0,
  [STORAGE_KEYS.DEVICE_ID]: 106,
  // 106 or 107 is correct, 106 set by default,
  [STORAGE_KEYS.TESTER_ID]: "123",
  // tester's ID
  [STORAGE_KEYS.EXPERIMENT_TYPE]: "alone",
  // alone and together are correct values, alone by default
  [STORAGE_KEYS.VIDEO_LIMIT]: 1,
  // Most likely it will be set to 1 or 2
  [STORAGE_KEYS.VIDEO_URLS]: ["https://www.netflix.com/watch/80025316?trackId=14170286"],
  [STORAGE_KEYS.RUNNING]: false
};
const MESSAGE_TEMPLATE = {
  HEADER: "header",
  DATA: "data",
  ARCHIVE: "archive"
};
const MESSAGE_HEADERS = {
  START_ANALYZING: "start_analyzing",
  NERD_STATISTICS: "nerdstats",
  ASSESSMENT: "assessment",
  FINISHED: "finished",
  CREDITS: "credits"
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(STATS_RECORD_INTERVAL_MS, "STATS_RECORD_INTERVAL_MS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(STATS_NONCLICKABLE, "STATS_NONCLICKABLE", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(STATS_INVISIBLE, "STATS_INVISIBLE", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(BITRATE_CHANGE_INTERVAL, "BITRATE_CHANGE_INTERVAL", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(ASSESSMENT_INTERVAL, "ASSESSMENT_INTERVAL", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(DATABASE_KEYS, "DATABASE_KEYS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(DATABASE_DEFAULT, "DATABASE_DEFAULT", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(ARCHIVE_KEYS, "ARCHIVE_KEYS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(ARCHIVE_DEFAULT, "ARCHIVE_DEFAULT", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(ASSESSMENTS_KEYS, "ASSESSMENTS_KEYS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(ASSESSMENTS_DEFAULT, "ASSESSMENTS_DEFAULT", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(STORAGE_KEYS, "STORAGE_KEYS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(STORAGE_DEFAULT, "STORAGE_DEFAULT", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(MESSAGE_TEMPLATE, "MESSAGE_TEMPLATE", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
  reactHotLoader.register(MESSAGE_HEADERS, "MESSAGE_HEADERS", "C:\\Users\\rafal\\Desktop\\TUFIQoE\\WatchingWithFriends-TUFIQoE-2022\\extension\\src\\pages\\config.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c265caaa9b1664252e3b")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=testScript.113e9a6b19f64e137865.hot-update.js.map