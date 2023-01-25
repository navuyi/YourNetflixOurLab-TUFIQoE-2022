import React from "react";
import Input from "./Input/Input";
import { useSelector } from "react-redux";
import { T_APP_STATE } from "../redux/reducers";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { T_SUBJECT_ID_ACTIONS } from "../redux/actions/subjectIDActions";
import { remove_whitespaces } from "../../../utils/string_utils";

const SubjectIDInput = () => {
    const subject_id = useSelector((state : T_APP_STATE) => state.subject_id)
    const subjectIDDispatch = useDispatch<Dispatch<T_SUBJECT_ID_ACTIONS>>()

    const handleChange = (value : string) => {
        subjectIDDispatch({
            type: "SET_ID",
            payload: remove_whitespaces(value)
        })
    }

    return(
        <Input 
            label="Subject ID"
            handleChange={handleChange}
            value={subject_id}
        />
    )
}

export default SubjectIDInput