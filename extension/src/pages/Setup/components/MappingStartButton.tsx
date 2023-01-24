import React from "react";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const MappingStartButton = (props : T_PROPS) => {
    return(
        <Button
            text="Run extension in mapping mode"
            style={{
                backgroundColor: "#00A896"
            }}
        />
    )
}

export default MappingStartButton