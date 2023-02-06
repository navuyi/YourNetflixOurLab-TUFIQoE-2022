import React from "react";
import { useSelector } from "react-redux";
import { ChromeStorage } from "../../../utils/custom/ChromeStorage";
import { post_new_experiment } from "../../../utils/http_requests/post_new_experiment";
import { post_new_video } from "../../../utils/http_requests/post_new_video";
import { remove_whitespaces } from "../../../utils/string_utils";
import { get_local_datetime } from "../../../utils/time_utils";
import { T_APP_STATE } from "../redux/reducers";
import Button from "./Button/Button";

type T_PROPS = {
    
}

const ExperimentStartButton = (props : T_PROPS) => {
    const subjectID = useSelector((state:T_APP_STATE) => state.subject_id)
    const {experiment_applicable} = useSelector((state:T_APP_STATE) => state.config)
    
    // TODO transfer this to a custom hook view-logic separation
    const handleExperimentStart = async () => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        const timestamp = get_local_datetime(new Date())

        // Create experiment
        const database_experiment_id = await post_new_experiment({
            subject_id: variables.subject_id, 
            started: timestamp,
            urls: JSON.stringify(settings.config?.videos.map(video => video.url)),
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
        const video_url = settings.config?.videos[variables.video_index].url
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
                backgroundColor: "#DB0000"
            }}
            attributes={{disabled: (remove_whitespaces(subjectID)==="" || !experiment_applicable)}}
            handleClick={() => {handleExperimentStart()}}
        />
    )
}

export default ExperimentStartButton