import React from "react";
import DeviceID from "./components/DeviceID"
import SessionType from "./components/SessionType"
import TesterIDContainer from "./components/TesterIDContainer"
import StartExperimentButton from "./components/StartExperimentButton/StartExperimentButton";
import useDeviceID from "./hooks/useDeviceID";

import { Row, Col } from "react-bootstrap"

import { STORAGE_KEYS } from "../../../config";

const ExperimentSetup = (props) => {

    const { deviceID, setDeviceID } = useDeviceID()

    return (
        <>
            <h1 style={{ textAlign: "left" }}>Netflix Experiment Setup</h1>

            <h2 style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}>Device settings</h2>
            <DeviceID
                deviceID={deviceID}
                setDeviceID={setDeviceID}
            />

            <h2 style={{ marginTop: "30px", textAlign: "left", fontWeight: "bold" }}>Experiment settings</h2>

            <SessionType />

            <TesterIDContainer
                deviceID={deviceID}
            />


            <Row className="mt-5">
                <StartExperimentButton />
            </Row>
        </>
    )
}


export default ExperimentSetup