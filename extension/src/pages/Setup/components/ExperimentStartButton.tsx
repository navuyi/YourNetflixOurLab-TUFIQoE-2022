import React from "react";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const ExperimentStartButton = (props : T_PROPS) => {

    return(
        <Button 
            text="Run extension in experiment mode"
            style={{
                backgroundColor: "#DB0000"
            }}
            attributes={{disabled: false}}
            handleClick={() => {}}
        />
    )
}

export default ExperimentStartButton