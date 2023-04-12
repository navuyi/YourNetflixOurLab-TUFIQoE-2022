import { useState } from "react"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { post_new_video } from "../../../../utils/http_requests/post_new_video"
import { get_local_datetime } from "../../../../utils/time_utils"


export const useResumeExperiment = (timeout:number) => {
    const [enabled, setEnabled] = useState<boolean>(false)
    const [resuming, setResuming] = useState<boolean>(false)

    const init = () => {
        setTimeout(() => {
            setEnabled(true)
        }, timeout*1000)
    }

    const handle_experiment_resume = async () : Promise<void> => {
        setResuming(true)

        // Create new video
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()
        const data = {
            url: settings.videos[variables.video_index].url as string,
            experiment_id: variables.database_experiment_id,
            started: get_local_datetime(new Date())
        }
        const video_id = await post_new_video(data)
        await update_chrome_storage(video_id as number)

        window.location.href = data.url
    }

    const update_chrome_storage = async (video_id:number) : Promise<void> => {
        const variables = await ChromeStorage.get_experiment_variables()
        variables.database_video_id = video_id
        await ChromeStorage.set_experiment_variables(variables)
    }

    return {
      enabled,
      init, handle_experiment_resume, resuming
    }
}