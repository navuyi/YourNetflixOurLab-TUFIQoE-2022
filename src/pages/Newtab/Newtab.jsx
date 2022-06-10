import React, {useState} from 'react';
import './Newtab.css';
import './Newtab.scss';
import {save_json} from "../../utils/save_json";

import {useEffect} from "react";
import {STORAGE_KEYS} from "../config";
import { STORAGE_DEFAULT } from '../config';
import {get_local_datetime} from "../../utils/time_utils"
import { update_video } from '../../http_requests/update_video';
import { create_video } from '../../http_requests/create_video';

const Newtab = () => {
  const [seconds, setSeconds] = useState(30)  // Change this value !! !! !! not timeout below
  const timeout = seconds * 1000
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const init = async () => {
      const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATABASE_VIDEO_ID,
        STORAGE_KEYS.DATABASE_EXPERIMENT_ID,
        STORAGE_KEYS.VIDEO_LIMIT,
        STORAGE_KEYS.VIDEO_COUNT,
        STORAGE_KEYS.VIDEO_URLS
      ])
      const video_limit = parseInt(res[STORAGE_KEYS.VIDEO_LIMIT])
      const video_count = parseInt(res[STORAGE_KEYS.VIDEO_COUNT])
      const video_index = video_count - 1


      //Update current video information --> updating video end time
      const update_data = {
        timestamp: get_local_datetime(new Date()),
        video_id: res[STORAGE_KEYS.DATABASE_VIDEO_ID]
      }
      await update_video(update_data)

    
      
      console.log(`Episode count: ${video_count}     Episode limit: ${video_limit}`)
      if(video_limit === video_count){
        // Experiment is finished
        setFinished(true)
        setTimeout(async () => {
          await chrome.storage.local.set(STORAGE_DEFAULT) // Set storage to default (includes reseting all the collected data)
          chrome.runtime.reload()
        }, 10000)
      }
      else{
       
        
    
        setTimeout(async () => {
          // Create new video in database
          const next_video_index = video_index + 1
          const next_url = res[STORAGE_KEYS.VIDEO_URLS][next_video_index]
          const next_video_data = {
            started: get_local_datetime(new Date()),
            experiment_id: res[STORAGE_KEYS.DATABASE_EXPERIMENT_ID],
            video_index: next_video_index, // Next video index
            url: next_url
          }
          await create_video(next_video_data)

          // Redirect to the next url
          const tabs = await chrome.tabs.query({active: true, currentWindow: true})
          await chrome.tabs.update(tabs[0].id, {
            url: next_url
          })
        }, timeout)
        start_countdown()
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