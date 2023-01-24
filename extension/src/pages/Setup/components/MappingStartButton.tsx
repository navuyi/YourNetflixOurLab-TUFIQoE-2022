import React from "react";
import { useButton } from "../hooks/useButton";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const MappingStartButton = (props : T_PROPS) => {

    const {handle_count_decrease, handle_count_increase} = useButton()

    return(
        <Button
            text="Run extension in mapping mode"
            style={{
                backgroundColor: "#00A896"
            }}
            handleClick={handle_count_decrease}
        />
    )
}

export default MappingStartButton