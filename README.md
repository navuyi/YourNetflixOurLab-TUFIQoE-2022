# FixYourNetflix-TUFIQoE-2022

Chrome extension and Python/flask REST API for [ecologically valid](https://en.wikipedia.org/wiki/Ecological_validity) QoE experiment using Netflix streaming platform. 
Requires simultaneous usage of Netflix-1080p extension.


## Technology stack
Frontend (Chrome extension)
- Webpack
- React
- Javascript

Backend
- Python (Flask)
- Sqlite3

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **14**.
2. Clone this repository.
3. Go to /extension folder.
4. Run `npm install` to install the dependencies.
5. Run `npm run build`
6. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
7. Happy hacking.
