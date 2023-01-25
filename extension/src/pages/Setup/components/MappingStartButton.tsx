import React from "react";
import { useSelector } from "react-redux";
import { T_APP_STATE } from "../redux/reducers";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const MappingStartButton = (props : T_PROPS) => {

    const {mapping_applicable} = useSelector((state:T_APP_STATE) => state.config)

    return(
        <Button
            text="Run extension in mapping mode"
            style={{
                backgroundColor: "#00A896"
            }}
            attributes={{disabled: !mapping_applicable}}
            handleClick={() => {}}
        />
    )
}

export default MappingStartButton