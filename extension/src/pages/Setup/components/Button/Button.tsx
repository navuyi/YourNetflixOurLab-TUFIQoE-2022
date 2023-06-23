import React from "react";
import style from "./style.module.scss"


type T_PROPS = {
    text: string,
    style? : object,
    attributes?: object,
    handleClick: Function
}

const Button = (props : T_PROPS) => {
    
    return(
        <>
            <button onClick={(e) => {props.handleClick()}} className={style.button} style={props.style} {...props.attributes}>{props.text}</button>
        </>
    )
}

export default Button