import React, {useEffect, useState} from 'react';


import './Popup.css';
import SessionType from "./Components/SessionType";
import EpisodesAmount from './Components/EpisodesAmount';
import DeviceID from "./Components/DeviceID";
import TesterIDContainer from './Components/TesterIDContainer';
import StartButton from './Components/StartButton';
import EpisodesURL from "./Components/EpisodesURL";
import { STORAGE_KEYS } from '../config';
import EmergencySaveButton from './Components/EmergencySaveButton';


const Popup = () => {
    const [deviceID, setDeviceID] = useState(1)
    const [episodesAmount, setEpisodesAmount] = useState(1)

    useEffect(() => {
        console.log(episodesAmount)
    }, [episodesAmount])

  
    return (
        <div className="App" >
            <h1 >Watching with Friends</h1>
            <StartButton />
            <h2>Device settings</h2>
            <DeviceID 
                deviceID={deviceID}
                setDeviceID={setDeviceID}
            />

            <h2 style={{marginTop: "30px"}}>Experiment settings</h2>
            <SessionType />
            <EpisodesAmount
                episodesAmount={episodesAmount}
                setEpisodesAmount={setEpisodesAmount}
            />
            <EpisodesURL
                episodesAmount={episodesAmount}
            />
            <TesterIDContainer 
                deviceID={deviceID}
            />
            <EmergencySaveButton />
        </div>
        );
    };

export default Popup;
