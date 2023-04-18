import React from "react";
import style from "./style.module.scss"


type T_PROPS = {
    label?: string
    type?: string
    value: string
    placeholder?: string
    handleChange: Function
    disabled: boolean
}

const Input = (props : T_PROPS) => {

    return(
        <div className={style.wrapper}>
            {
                props.label ? <span className={style.label}>{props.label}</span> : null
            }
            <input 
                className={style.input}
                type={props.type}
                value={props.value}
                onChange={(e) => props.handleChange(e.currentTarget.value)}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
        </div>
        
    )
}


export default Input