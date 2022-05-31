import React, {useState} from 'react';
import './Newtab.css';
import './Newtab.scss';
import {save_json} from "../../utils/save_json";

import {useEffect} from "react";
import {STORAGE_KEYS} from "../config";
import { STORAGE_DEFAULT } from '../config';
import {get_local_datetime} from "../../utils/time_utils"

const Newtab = () => {
  const [seconds, setSeconds] = useState(30)  // Change this value !! !! !! not timeout below
  const timeout = seconds * 1000
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const init = async () => {
      // Save data as json file
      const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATA_TO_SAVE,
        STORAGE_KEYS.ARCHIVE_TO_SAVE,
        STORAGE_KEYS.ASSESSMENTS_TO_SAVE,
        STORAGE_KEYS.DEVICE_ID,
        STORAGE_KEYS.EXPERIMENT_TYPE,
        STORAGE_KEYS.VIDEO_LIMIT,
        STORAGE_KEYS.VIDEO_URLS,
        STORAGE_KEYS.TESTER_ID,
        STORAGE_KEYS.VIDEO_COUNT
      ])
      const data = res[STORAGE_KEYS.DATA_TO_SAVE]
      const archive = res[STORAGE_KEYS.ARCHIVE_TO_SAVE]
      const assessments = res[STORAGE_KEYS.ASSESSMENTS_TO_SAVE]

      console.log(data)
      console.log(archive)
      console.log(assessments)
      
      const episode_limit = parseInt(res[STORAGE_KEYS.VIDEO_LIMIT])
      const video_count = parseInt(res[STORAGE_KEYS.VIDEO_COUNT])
      const episode_index = video_count - 1

      // Complete data
      const results = {
        info: {
          device_id: res[STORAGE_KEYS.DEVICE_ID],
          experiment_type: res[STORAGE_KEYS.EXPERIMENT_TYPE],
          video_limit: res[STORAGE_KEYS.VIDEO_LIMIT],
          episode_index: episode_index,
          video_url: res[STORAGE_KEYS.VIDEO_URLS][episode_index],
          tester_id: res[STORAGE_KEYS.TESTER_ID]
        },
        assessments: assessments,
        data: data
      }



      // Save files
      const timestamp = get_local_datetime(new Date())
      const results_filename = `results_${results.info.tester_id}_${results.info.experiment_type}_${timestamp}.json`;  
      const archive_filename = `archive_${results.info.tester_id}_${results.info.experiment_type}_${timestamp}.json`;  
     
      const results_json = save_json(results, results_filename)
      const archive_json = save_json(archive, archive_filename)

      if(results_json && archive_json){
        const data = await chrome.storage.local.get([STORAGE_KEYS.VIDEO_LIMIT, STORAGE_KEYS.VIDEO_COUNT, STORAGE_KEYS.VIDEO_URLS])
        
        console.log(`Episode count: ${video_count}     Episode limit: ${episode_limit}`)
        if(episode_limit === video_count){
          setFinished(true)
          setTimeout(async () => {
            await chrome.storage.local.set(STORAGE_DEFAULT) // Set storage to default (includes reseting all the collected data)
            chrome.runtime.reload()
          }, 10000)
        }
        else{
          setTimeout(async () => {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            const next_url = data[STORAGE_KEYS.VIDEO_URLS][episode_index + 1]
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