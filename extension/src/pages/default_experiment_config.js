export const DEFAULT_EXPERIMENT_CONFIGURATION = {
    title: "This is my config for development purposes",
    description: "",
    bitrate_change_interval: 300,
    episodes: [
        {
            "name": "Narcos_s01_e04",
            "description": "Lorem ipsum",
            "url": "https://www.netflix.com/watch/70196252?trackId=14170286",
            "vmaf_template": [
                20,
                50,
                20,
                90,
                45,
                51
            ],
            "bitrate_vmaf_map": [
                {bitrate: 100, vmaf: 25},
                {bitrate: 250, vmaf: 35},
                {bitrate: 500, vmaf: 50},
                {bitrate: 1750, vmaf: 85},
            ]
        },
        {
            "name": "Narcos_s02_e02",
            "description": "Lorem ipsum",
            "url": "https://www.netflix.com/watch/80101274?trackId=14170286",
            "vmaf_template": [
                20,
                50,
                20,
                90,
                45,
                51
            ],
            "bitrate_vmaf_map": [
                {bitrate: 100, vmaf: 25},
                {bitrate: 250, vmaf: 35},
                {bitrate: 500, vmaf: 50},
                {bitrate: 1750, vmaf: 32},
                {bitrate: 4250, vmaf: 23},
                {bitrate: 3500, vmaf: 90},
                {bitrate: 1750, vmaf: 95},
                {bitrate: 1250, vmaf: 65},
                {bitrate: 1500, vmaf: 50},
                {bitrate: 1750, vmaf: 85},
            ]
        }
    ]
  }