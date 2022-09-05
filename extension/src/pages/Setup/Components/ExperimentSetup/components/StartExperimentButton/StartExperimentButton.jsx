import React from "react";
import { STORAGE_KEYS } from "../../../../../config";
import { create_experiment } from "../../../../../../http_requests/create_experiment";
import { get_local_datetime } from "../../../../../../utils/time_utils";
import { create_video } from "../../../../../../http_requests/create_video";

import { Button } from "react-bootstrap";
import useStartExperiment from "../../hooks/useStartExperiment";

const StartExperimentButton = (props) => {

    const {handleClick} = useStartExperiment()


    return (
        <Button variant="danger" onClick={handleClick} style={{ backgroundColor: "#E50914" }}> Start </Button>
    )
}


export default StartExperimentButton