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
import axios from 'axios';
import { backend_urls } from '../../http_requests/config';

const Popup = () => {
    const [deviceID, setDeviceID] = useState(1)
    const [episodesAmount, setEpisodesAmount] = useState(1)
    const [backendActive, setBackendActive] = useState(false)

    useEffect(() => {
        const init = async () => {
            try{
                const response = await axios.get(backend_urls.connection_test)
                if(response.status === 200){
                    setBackendActive(true)
                }
            }
            catch(err){
                console.log(err)
            }
        }

        init()
    }, [])

  
    return (
        <div className="App" >
            {
                backendActive ? <>
                    <h1>Watching with Friends</h1>
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
                </> : 
                <h3 style={{color: "red", marginTop: "50px"}}>Backend server is not active!</h3>
            }
        </div>
        );
    };

export default Popup;
