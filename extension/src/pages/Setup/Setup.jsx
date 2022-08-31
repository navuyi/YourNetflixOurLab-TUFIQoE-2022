import React from 'react';
import { useState } from 'react';

import { useEffect } from 'react';
import SessionType from "./Components/SessionType";
import EpisodesAmount from './Components/EpisodesAmount';
import DeviceID from "./Components/DeviceID";
import TesterIDContainer from './Components/TesterIDContainer';
import StartButton from './Components/StartButton';
import EpisodesURL from "./Components/EpisodesURL";
import BitrateModeSwitch from './Components/BitrateModeSwitch';
import axios from 'axios';
import { backend_urls } from '../../http_requests/config';


import { Container, Col, Row } from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.css'
import './Setup.scss';
import ConfigFileMenu from './Components/ConfigFileMenu';

const Setup = () => {
  const [deviceID, setDeviceID] = useState(1)
  const [episodesAmount, setEpisodesAmount] = useState(1)
  const [backendActive, setBackendActive] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.get(backend_urls.connection_test)
        if (response.status === 200) {
          setBackendActive(true)
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    init()
  }, [])


  return (
    <div className="App" >
      {
        backendActive ?
          <Container fluid className='mt-5'>
            <Row className="justify-content-between">
              <Col xxl={6} xl={6} lg={8} md={12} className="mt-5 mt-xl-0" style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}> <h1>Bitrate schedule</h1>
                <ConfigFileMenu />
              </Col>
              <Col xxl={4} xl={6} lg={8} md={12} style={{ alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ textAlign: "left" }}>Netflix Experiment Setup</h1>

                <h2 style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}>Device settings</h2>
                <DeviceID
                  deviceID={deviceID}
                  setDeviceID={setDeviceID}
                />

                <h2 style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}>Experiment settings</h2>
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
                <BitrateModeSwitch />

                <Row className="mt-5">
                  <StartButton />
                </Row>
              </Col>


            </Row>

          </Container> :

          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "Center" }}>
            <h3 style={{ fontSize: 32, color: "#f60000", fontWeight: "100", fontWeight: "bolder" }}>Backend server is not active!</h3>
          </div>
      }
    </div >
  );
};

export default Setup;