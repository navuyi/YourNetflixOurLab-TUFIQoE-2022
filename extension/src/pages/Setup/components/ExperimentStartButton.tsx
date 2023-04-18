import React, { useLayoutEffect, useState } from "react";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import { post_new_experiment } from "../../../utils/http_requests/post_new_experiment";
import { post_new_video } from "../../../utils/http_requests/post_new_video";
import { get_local_datetime } from "../../../utils/time_utils";
import Button from "./Button/Button";
import { useSelector } from "react-redux";
import { T_APP_STATE } from "../redux/reducers";
import { useDispatch } from "react-redux";
import { T_SETUP_ACTIONS } from "../redux/actions/setupActions";
import { Dispatch } from "redux";

const ExperimentStartButton = () => {
    const setup = useSelector((state:T_APP_STATE) => state.setup)
    const setupDispatch = useDispatch<Dispatch<T_SETUP_ACTIONS>>()

    const subjectID = useSelector((state:T_APP_STATE) => state.subject_id)

    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            console.log(settings)
            if(settings.videos.length === 0){
                return
            }
            if(settings.videos.some(video => video.scenario == null || video.bitrate_vmaf_map == null)){
                return
            }

            setupDispatch({
                type:"SET_SETUP", key: "experimentAvailable", payload: true
            })
        }

        init()
    }, [])

    const handleExperimentStart = async () => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        const timestamp = get_local_datetime(new Date())

        // Create experiment
        const database_experiment_id = await post_new_experiment({
            subject_id: variables.subject_id, 
            started: timestamp,
            urls: JSON.stringify(settings.videos.map(video => video.url)),
            settings: JSON.stringify(settings)
        })
        if(database_experiment_id === null || database_experiment_id === undefined){
            window.alert("Cannot start experiment. Experiment entry could not be created. Check server connection.")
            return
        }
        // Update database_experiment_id
        variables.database_experiment_id = database_experiment_id
        await ChromeStorage.set_experiment_variables(variables)
        

        // Create video
        const video_url = settings.videos[variables.video_index].url
        if(video_url === null || video_url === undefined){
            window.alert("Video url could not be accessed. Internal error")
            return
        }
        const database_video_id = await post_new_video({
            started: timestamp,
            url: video_url,
            experiment_id: database_experiment_id
        })

        if(database_video_id === null || database_video_id === undefined){
            window.alert("Cannot start experiment. Video entry could not be created. Check server connection.")
            return
        }
        // Update database_video_id
        variables.database_video_id = database_video_id
        await ChromeStorage.set_experiment_variables(variables)

        // Redirect to the first video
        variables.extension_running = true
        variables.extension_mode = "main"
        await ChromeStorage.set_experiment_variables(variables)

        window.location.href = video_url
    }

    return(
        <Button 
            text="Run extension in experiment mode"
            style={{
                backgroundColor: "#ffc857ff",
                marginTop: "5px"
            }}
            attributes={{disabled: !setup.experimentAvailable || !subjectID}}
            handleClick={() => {handleExperimentStart()}}
        />
    )
}

export default ExperimentStartButton