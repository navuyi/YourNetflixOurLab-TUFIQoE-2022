import React from "react";
import { Button } from "react-bootstrap";
import useStartExperiment from "../../hooks/useStartExperiment";

const StartExperimentButton = (props) => {

    const { handleClick } = useStartExperiment()


    return (
        <Button variant="danger" onClick={handleClick} style={{ backgroundColor: "#E50914" }}> Start </Button>
    )
}


export default StartExperimentButton