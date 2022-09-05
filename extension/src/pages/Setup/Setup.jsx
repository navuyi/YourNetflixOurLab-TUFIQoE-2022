import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import axios from 'axios';
import { backend_urls } from "../../http_requests/config"

import { Container, Col, Row } from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.css'
import './Setup.scss';
import ConfigFileMenu from './Components/ConfigFileMenu/ConfigFileMenu';
import ExperimentSetup from './Components/ExperimentSetup/ExperimentSetup';

const Setup = () => {
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
          <Container fluid className='mt-5 pt-5 pb-5'>
            <Row className="justify-content-between">
              <Col xxl={6} xl={6} lg={8} md={12} style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}>
                <ConfigFileMenu />
              </Col>
              <Col xxl={4} xl={6} lg={8} md={12} className="mt-5 mt-xl-0" style={{ alignItems: "center", justifyContent: "center" }}>
                <ExperimentSetup />
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