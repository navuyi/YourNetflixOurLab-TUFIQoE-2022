import React, {useState} from 'react';
import './Newtab.css';
import './Newtab.scss';
import {save_json} from "../../utils/save_json";

import {useEffect} from "react";
import {STORAGE_KEYS} from "../config";


const Newtab = () => {
  const [seconds, setSeconds] = useState(10)  // Change this value !! !! !! not timeout below
  const timeout = seconds * 1000
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const init = async () => {

      // Make it fullscreen (F11 to exit)
      chrome.windows.getCurrent(window => {
        chrome.windows.update(window.id, {state: "fullscreen"})
      })

      // Save data as json file
      const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATA_TO_SAVE,
        STORAGE_KEYS.ARCHIVE_TO_SAVE
      ])
      const data = res[STORAGE_KEYS.DATA_TO_SAVE]
      const archive = res[STORAGE_KEYS.ARCHIVE_TO_SAVE]

      const data_filename = "data.json" // make it more informative
      const archive_filename = "archive.json" // make it more informative

      const saved_01 = save_json(data, data_filename)
      const saved_02 = save_json(archive, archive_filename)

      if(saved_01 && saved_02){
        const data = await chrome.storage.local.get([STORAGE_KEYS.EPISODES_LIMIT, STORAGE_KEYS.EPISODE_COUNT, STORAGE_KEYS.EPISODES_URL])
        const episode_limit = data[STORAGE_KEYS.EPISODES_LIMIT]
        const episode_count = data[STORAGE_KEYS.EPISODE_COUNT]
        const episode_index = episode_count - 1

        if(episode_limit === episode_count){
          setFinished(true)
        }
        else{
          setTimeout(async () => {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            const next_url = data[STORAGE_KEYS.EPISODES_URL][episode_index + 1]
            await chrome.tabs.update(tabs[0].id, {
              url: next_url
            })
          }, timeout)
          start_countdown()
        }
      }
    }

    init()
  }, [])


  const start_countdown = () => {
    let interval = undefined
    interval = setInterval(() => {
      console.log("ASDADAS")
      if(seconds === 1){
        clearInterval(interval)
        return
      }
      setSeconds(prevState => {console.log(prevState); return prevState-1;})
    }, 1000)
  }

return (
  <div className="App" style={{backgroundColor: "#222222"}}>
    <div>
      {
      !finished ? <h3>{`Trwa synchronizacja. Następny odcinek za ${seconds} sekund.`}</h3> :
      <h3>{`Seans zakończony. Proszę zawiadomić administratora eksperymentu.`}</h3>
      }
    </div>
  </div>
  );
};

export default Newtab;