import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import SessionType from "./Components/SessionType";
import EpisodesAmount from './Components/EpisodesAmount';
import DeviceID from "./Components/DeviceID";
import TesterIDContainer from './Components/TesterIDContainer';


const Popup = () => {
    const [deviceID, setDeviceID] = useState(1)


    return (
        <div className="App" >
            <h1 >Watching with Friends</h1>
            <h2>Device settings</h2>
            <DeviceID 
                deviceID={deviceID}
                setDeviceID={setDeviceID}
            />

            <h2 style={{marginTop: "30px"}}>Experiment settings</h2>
            <SessionType />
            <EpisodesAmount />
            <TesterIDContainer 
                deviceID={deviceID}
            />
        </div>
        );
    };

export default Popup;
