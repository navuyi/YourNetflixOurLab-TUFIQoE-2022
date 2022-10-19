export const DEFAULT_EXPERIMENT_CONFIGURATION = {
  "assessment_interval": 150,
  "bitrate_interval": 150,
  "description": "can be left as empty string",
  "videos": [
    {
      "bitrate_vmaf_map": [
        {
          "bitrate": 80,
          "vmaf": "37"
        },
        {
          "bitrate": 100,
          "vmaf": "43"
        },
        {
          "bitrate": 141,
          "vmaf": "52"
        },
        {
          "bitrate": 218,
          "vmaf": "63"
        },
        {
          "bitrate": 338,
          "vmaf": "71"
        },
        {
          "bitrate": 601,
          "vmaf": "79"
        },
        {
          "bitrate": 1149,
          "vmaf": "85"
        },
        {
          "bitrate": 2472,
          "vmaf": "88"
        },
        {
          "bitrate": 3439,
          "vmaf": "89"
        },
        {
          "bitrate": 5147,
          "vmaf": "90"
        }
      ],
      "description": "Lorem ipsum",
      "name": "Narcos_s01_e04",
      "scenario": [
        {
          "bitrate": 80,
          "vmaf": 37,
          "vmaf_diff": 17,
          "vmaf_template": 20
        },
        {
          "bitrate": 141,
          "vmaf": 52,
          "vmaf_diff": 2,
          "vmaf_template": 50
        },
        {
          "bitrate": 80,
          "vmaf": 37,
          "vmaf_diff": 17,
          "vmaf_template": 20
        },
        {
          "bitrate": 5147,
          "vmaf": 90,
          "vmaf_diff": 0,
          "vmaf_template": 90
        },
        {
          "bitrate": 100,
          "vmaf": 43,
          "vmaf_diff": 2,
          "vmaf_template": 45
        },
        {
          "bitrate": 141,
          "vmaf": 52,
          "vmaf_diff": 1,
          "vmaf_template": 51
        }
      ],
      "url": "https://www.netflix.com/watch/70196252?trackId=14170286",
      "vmaf_template_scenario": [
        20,
        50,
        20,
        90,
        45,
        51
      ]
    },
    {
      "bitrate_vmaf_map": [
        {
          "bitrate": 86,
          "vmaf": "40"
        },
        {
          "bitrate": 106,
          "vmaf": "46"
        },
        {
          "bitrate": 146,
          "vmaf": "55"
        },
        {
          "bitrate": 233,
          "vmaf": "67"
        },
        {
          "bitrate": 369,
          "vmaf": "76"
        },
        {
          "bitrate": 623,
          "vmaf": "84"
        },
        {
          "bitrate": 976,
          "vmaf": "89"
        },
        {
          "bitrate": 1571,
          "vmaf": "92"
        },
        {
          "bitrate": 3083,
          "vmaf": "95"
        }
      ],
      "description": "Lorem ipsum",
      "name": "Narcos_s02_e02",
      "scenario": [
        {
          "bitrate": 86,
          "vmaf": 40,
          "vmaf_diff": 20,
          "vmaf_template": 20
        },
        {
          "bitrate": 106,
          "vmaf": 46,
          "vmaf_diff": 4,
          "vmaf_template": 50
        },
        {
          "bitrate": 86,
          "vmaf": 40,
          "vmaf_diff": 20,
          "vmaf_template": 20
        },
        {
          "bitrate": 976,
          "vmaf": 89,
          "vmaf_diff": 1,
          "vmaf_template": 90
        },
        {
          "bitrate": 106,
          "vmaf": 46,
          "vmaf_diff": 1,
          "vmaf_template": 45
        },
        {
          "bitrate": 146,
          "vmaf": 55,
          "vmaf_diff": 4,
          "vmaf_template": 51
        }
      ],
      "url": "https://www.netflix.com/watch/80101274?trackId=14170286",
      "vmaf_template_scenario": [
        20,
        50,
        20,
        90,
        45,
        51
      ]
    }
  ],
  "title": "This is my config for development purposes"
}