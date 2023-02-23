# FixYourNetflix-TUFIQoE-2022

Chrome extension and Python/flask REST API for [ecologically valid](https://en.wikipedia.org/wiki/Ecological_validity) QoE experiment using Netflix streaming platform. 
<b>Does NOT require usage of Netflix-1080p extension.</b>



# Technology stack
Frontend (Chrome extension)
- Webpack
- React
- Typescript
- HTML
- CSS (SASS)

Backend
- Python (Flask)
- Sqlite3


# Installation
Installation and execution has been tested on macOS and Windows opearting systems. 

## Backend
Python is required. 
1. Inside <b>backend</b> directory run `python -m venv venv` 
2. Install packages listed in requirements.txt
    - activate venv (syntax depends is OS dependent)
    - `pip install -r requirements.txt`
3. Navigate to backend/database and run `python init.py` in order to initalize SQLite3 databse file
4. Start backend server by running startup proper startup file in <b>backend</b> directory: 
    - `source start-mac.sh` or
    - `start-windows.bat`<br>

## Extension
Node is required
1. Inside <b>extension</b> directory run `npm install` in order to install dependencies
2. Run `npm run build` to generate Chrom extension build package
3. Open <b>Extensions</b> in Chrome browser
4. Activate <b>Developer Mode</b> 
5. Click <b>Load unpacked</b> and import build directory generated in step 2.

# Glossary
- empty config - configuration file that does NOT contain all of the key-value pairs required to run experiment 
    - mapping applicable
    - NOT experiment applicable

- complete config - configuration file that does contain all of the key-value pairs required to run experiment
    - mapping applicable (can be regenerated)
    - experiment applicable

- Bitrate to VMAF mapping - process of discovering VMAF substitutes to bitrate values available for a video in Netflix streaming platform. It is done by iterating. In this mode there is no communication with server.


# Configuration file

## Empty config file
```
{
  "assessment_interval": 150,
  "bitrate_interval": 150,
  "description": "description",
  "title": "title",
  "videos": [
    {
      "description": "",
      "name": "wielka_woda_s01e01",
      "url": "https://www.netflix.com/watch/81387423",
      "vmaf_template_scenario": [
        90,50,40,70,60,30,60,80,100,80,70,100,90,50,40,20
      ]
    }
  ]
}
```

## Complete config file
```
{
  "assessment_interval": 150,
  "bitrate_interval": 150,
  "description": "",
  "title": "",
  "videos": [
    {
      "bitrate_vmaf_map": [
        {
          "bitrate": 101,
          "vmaf": 45
        },
        {
          "bitrate": 124,
          "vmaf": 55
        },
        {
          "bitrate": 153,
          "vmaf": 60
        },
        {
          "bitrate": 234,
          "vmaf": 71
        },
        {
          "bitrate": 364,
          "vmaf": 78
        },
        {
          "bitrate": 533,
          "vmaf": 83
        },
        {
          "bitrate": 949,
          "vmaf": 89
        },
        {
          "bitrate": 1618,
          "vmaf": 92
        },
        {
          "bitrate": 2919,
          "vmaf": 94
        },
        {
          "bitrate": 5886,
          "vmaf": 96
        }
      ],
      "description": "wielka_woda_s01e01",
      "name": "",
      "url": "https://www.netflix.com/watch/81387423",
      "vmaf_template_scenario": [
        90,50,40,70,60,30,60,80,100,80,70,100,90,50,40,20
      ],
      "scenario": [
        {
          "bitrate": 949,
          "vmaf": 89,
          "vmaf_template": 90,
          "vmaf_diff": 1
        },
        {
          "bitrate": 124,
          "vmaf": 55,
          "vmaf_template": 50,
          "vmaf_diff": 5
        },
        {
          "bitrate": 101,
          "vmaf": 45,
          "vmaf_template": 40,
          "vmaf_diff": 5
        },
        {
          "bitrate": 234,
          "vmaf": 71,
          "vmaf_template": 70,
          "vmaf_diff": 1
        },
        {
          "bitrate": 101,
          "vmaf": 45,
          "vmaf_template": 30,
          "vmaf_diff": 15
        },
        {
          "bitrate": 153,
          "vmaf": 60,
          "vmaf_template": 60,
          "vmaf_diff": 0
        },
        {
          "bitrate": 153,
          "vmaf": 60,
          "vmaf_template": 60,
          "vmaf_diff": 0
        },
        {
          "bitrate": 364,
          "vmaf": 78,
          "vmaf_template": 80,
          "vmaf_diff": 2
        },
        {
          "bitrate": 5886,
          "vmaf": 96,
          "vmaf_template": 100,
          "vmaf_diff": 4
        },
        {
          "bitrate": 364,
          "vmaf": 78,
          "vmaf_template": 80,
          "vmaf_diff": 2
        },
        {
          "bitrate": 234,
          "vmaf": 71,
          "vmaf_template": 70,
          "vmaf_diff": 1
        },
        {
          "bitrate": 5886,
          "vmaf": 96,
          "vmaf_template": 100,
          "vmaf_diff": 4
        },
        {
          "bitrate": 949,
          "vmaf": 89,
          "vmaf_template": 90,
          "vmaf_diff": 1
        },
        {
          "bitrate": 124,
          "vmaf": 55,
          "vmaf_template": 50,
          "vmaf_diff": 5
        },
        {
          "bitrate": 101,
          "vmaf": 45,
          "vmaf_template": 40,
          "vmaf_diff": 5
        },
        {
          "bitrate": 101,
          "vmaf": 45,
          "vmaf_template": 20,
          "vmaf_diff": 25
        }
      ]
    }
  ]
}
```