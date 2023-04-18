import React, { useEffect, useLayoutEffect } from "react";
import Input from "./Input/Input";
import { useSelector } from "react-redux";
import { T_APP_STATE } from "../redux/reducers";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { T_SUBJECT_ID_ACTIONS } from "../redux/actions/subjectIDActions";
import { remove_whitespaces } from "../../../utils/string_utils";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";

const SubjectIDInput = () => {
    const subject_id = useSelector((state : T_APP_STATE) => state.subject_id)
    const subjectIDDispatch = useDispatch<Dispatch<T_SUBJECT_ID_ACTIONS>>()

    const setup = useSelector((state:T_APP_STATE) => state.setup)

    const handleChange = async (value : string) => {
        subjectIDDispatch({
            type: "SET_ID",
            payload: remove_whitespaces(value)
        })

        // Update subject_id in Storage
        const variables = await ChromeStorage.get_experiment_variables()
        variables.subject_id = value
        await ChromeStorage.set_experiment_variables(variables)
    }

    useLayoutEffect(() => {
        const init = async () => {
            const variables = await ChromeStorage.get_experiment_variables()
            subjectIDDispatch({
                type: "SET_ID",
                payload: variables.subject_id.toString()
            })
        }

        init()
    }, [])

    return(
        <Input 
            label="Subject ID"
            handleChange={handleChange}
            value={subject_id}
            disabled={!setup.experimentAvailable}
        />
    )
}

export default SubjectIDInput