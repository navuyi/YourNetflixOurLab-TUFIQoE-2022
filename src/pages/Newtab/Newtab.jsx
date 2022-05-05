import React, {useState} from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import {save_json} from "../../utils/save_json";

import {useEffect} from "react";
import {STORAGE_KEYS} from "../config";


const Newtab = () => {
  const [seconds, setSeconds] = useState(10)  // Change this value !! !! !! not timeout below
  const timeout = seconds * 1000

  useEffect(() => {
    const init = async () => {
      // Save data as json file
      const res = await chrome.storage.local.get([
        STORAGE_KEYS.DATA_TO_SAVE,
        STORAGE_KEYS.ARCHIVE_TO_SAVE
      ])
      console.log(res)
      const data = res[STORAGE_KEYS.DATA_TO_SAVE]
      const archive = res[STORAGE_KEYS.ARCHIVE_TO_SAVE]

      console.log(data)
      console.log(archive)

      const data_filename = "data.json"
      const archive_filename = "archive.json"

      const saved_01 = save_json(data, data_filename)
      const saved_02 = save_json(archive, archive_filename)

      if(saved_01 && saved_02){
        const index = (await chrome.storage.local.get([STORAGE_KEYS.EPISODE_INDEX]))[STORAGE_KEYS.EPISODE_INDEX]
        setTimeout(() => {
          chrome.tabs.update(tabs[0].id, {
            url: "https://www.netflix.com/browse"
          })
        }, timeout)
        start_countdown()
      }
      else{

      }
    }

    init()
  }, [])

  const detach_debugger = async (tabId) => {
    try{
      await chrome.debugger.detach({tabId: tabId})
    }
    catch (err){
      console.log(err)
    }
  }

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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <h3>{`File saved successfully. Redirecting to the next video in ${seconds} seconds.`}</h3>
          </div>
        </header>
      </div>
  );
};

export default Newtab;