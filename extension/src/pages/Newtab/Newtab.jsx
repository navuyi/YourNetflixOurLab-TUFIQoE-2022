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
import ContinueButton from './Components/ContinueButton';
import { useLayoutEffect } from 'react';
import ContinueHeader from './Components/ContinueHeader';

const Newtab = () => {
  const [seconds, setSeconds] = useState(5)  // Change this value !! !! !! not timeout below
  const timeout = seconds * 1000
  const [finished, setFinished] = useState(false)
  const [continueBtnVisible, setContinueBtnVisible] = useState(false)
  const [navigationInfo, setNavigationInfo] = useState({
    next_url: "",
    tab_id: null
  })

  useLayoutEffect(() => {
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

    
  
      console.log(`Video count: ${video_count}     Video limit: ${video_limit}`)
      if(video_limit === video_count){
        finish_experiment()
      }
      else{
        prepare_to_next_video(res, video_index)
      }
    }

    init()
  }, [])


  const prepare_to_next_video = (res, video_index) => {
    setTimeout(async () => {
      // Create new video in database
      const next_video_index = video_index + 1
      const next_url = res[STORAGE_KEYS.VIDEO_URLS][next_video_index];
      const next_video_data = {
        started: get_local_datetime(new Date()),
        experiment_id: res[STORAGE_KEYS.DATABASE_EXPERIMENT_ID],
        video_index: next_video_index, // Next video index
        url: next_url
      }
      await create_video(next_video_data)

      // Make Continue button visible
      const tabs = await chrome.tabs.query({active: true, currentWindow: true})
      setNavigationInfo({
        next_url: next_url,
        tab_id: tabs[0].id
      })
      setContinueBtnVisible(true)
    }, timeout)
    start_countdown()
  }

  const finish_experiment = () => {
    setFinished(true)
    setTimeout(async () => {
      await chrome.storage.local.set(STORAGE_DEFAULT) // Set storage to default (includes reseting all the collected data)
      chrome.runtime.reload()
    }, 10000)
  }

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
      !finished ? 
      !continueBtnVisible ? <h3>{`Trwa synchronizacja. Kontynuacja za ${seconds} sekund.`}</h3> : null
      :
      <h3>{`Seans zakończony. Proszę zawiadomić administratora eksperymentu.`}</h3>
      }
      {
        continueBtnVisible ? 
        <>
          <ContinueHeader />
          <ContinueButton navigationInfo={navigationInfo}/>
        </>
        : null
      }
    </div>
  </div>
  );
};

export default Newtab;