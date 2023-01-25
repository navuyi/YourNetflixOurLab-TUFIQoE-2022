import React from "react";
import { useSelector } from "react-redux";
import { remove_whitespaces } from "../../../utils/string_utils";
import { T_APP_STATE } from "../redux/reducers";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const ExperimentStartButton = (props : T_PROPS) => {
    const subjectID = useSelector((state:T_APP_STATE) => state.subject_id)
    const config = useSelector((state:T_APP_STATE) => state.config)
    
    return(
        <Button 
            text="Run extension in experiment mode"
            style={{
                backgroundColor: "#DB0000"
            }}
            attributes={{disabled: (remove_whitespaces(subjectID)==="" || config == null)}}
            handleClick={() => {}}
        />
    )
}

export default ExperimentStartButton