import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import SessionType from "./Components/SessionType";
import EpisodesAmount from './Components/EpisodesAmount';
import DeviceID from "./Components/DeviceID";

const Popup = () => {
    return (
        <div className="App" >
            <h1 >Watching with Friends</h1>
            <h2>Device settings</h2>
            <DeviceID />

            <h2 style={{marginTop: "30px"}}>Experiment settings</h2>
            <SessionType />
            <EpisodesAmount />
        </div>
        );
    };

export default Popup;
