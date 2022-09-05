import { create_experiment } from "../../../../../utils/http_requests/create_experiment"
import { create_video } from "../../../../../utils/http_requests/create_video";

import { CONFIGURATION_KEYS, STORAGE_KEYS } from "../../../../config";
import { get_local_datetime } from "../../../../../utils/time_utils";

const useStartExperiment = () => {

    const handleClick = async (e) => {
        // Validate configuration 
        const valid = await validate_configuration()

        if (valid) {
            // Create new experiment record in database
            await create_experiment_record()

            // Create new video record in database
            await create_video_record()

            await run_and_redirect()
        }
    }

    /**
     * Checks if configuration is valid before starting experiment to
     * avoid misconfigured experiments.
     * In case of an issue displays proper message as window alert.
     * @returns {Boolean}
    */
    const validate_configuration = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        if (!(CONFIGURATION_KEYS.VIDEOS in configuration)) {
            alert(`There is no "videos" key in configuration!`)
            return false
        }
        for (const video of configuration[CONFIGURATION_KEYS.VIDEOS]) {
            // Check bitrate_vmaf_map
            if (!(CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP in video)) {
                alert(`There is no ${CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP} in video config`)
                return false
            }
            else if (!Array.isArray(configuration[CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP])) {
                alert(`${CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP} should be an array of objects!`)
                return false
            }
            else if (configuration[CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP.length === 0]) {
                alert(`${CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP} cannot be empty!`)
                return false
            }

            // Check video's bitrate/vmaf scenario
            if (!(CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO in video)) {
                alert(`There is no ${CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO} in video config! Run bitrate-vmaf mapping before starting experiment.`)
                return false
            }
            else if (!Array.isArray(configuration[CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO])) {
                alert(`${CONFIGURATION_KEYS.VIDEO_KEYS.BITRATE_VMAF_MAP} should be an array of objects!`)
                return false
            }
        }
        // Finally return true and proceed
        return true
    }

    /**
     *  Creates new experiment record in database
    */
    const create_experiment_record = async () => {
        const res = await chrome.storage.local.get([
            STORAGE_KEYS.VIDEO_LIMIT,
            STORAGE_KEYS.VIDEO_COUNT,
            STORAGE_KEYS.DEVICE_ID,
            STORAGE_KEYS.EXPERIMENT_TYPE,
            STORAGE_KEYS.TESTER_ID
        ])

        const data = {
            started: get_local_datetime(new Date()),
            device_id: res[STORAGE_KEYS.DEVICE_ID],
            experiment_type: res[STORAGE_KEYS.EXPERIMENT_TYPE],
            video_limit: res[STORAGE_KEYS.VIDEO_LIMIT],
            tester_id: res[STORAGE_KEYS.TESTER_ID],
            urls: await get_experiment_urls()
        }

        await create_experiment(data)
    }


    /**
     *  Sends requests to the backend REST API 
     *  and creates new video record in database.
     *  Uses experiment_id returned from backend after creating experiment entry. 
    */
    const create_video_record = async () => {
        const res = await chrome.storage.local.get([
            STORAGE_KEYS.DATABASE_EXPERIMENT_ID,
            STORAGE_KEYS.VIDEO_COUNT,
            STORAGE_KEYS.CONFIGURATION
        ])
        const data = {
            started: get_local_datetime(new Date()),
            experiment_id: res[STORAGE_KEYS.DATABASE_EXPERIMENT_ID],
            video_index: 0, //<-- simply 0 or parseInt(res[STORAGE_KEYS.VIDEO_COUNT]),
            url: res[STORAGE_KEYS.CONFIGURATION].videos[0].url // First video's url
        }
        await create_video(data)
    }


    /**
     *  Starts the extension experiment mode and redirects to the first video in configuration 
    */
    const run_and_redirect = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const start_url = configuration.videos[0].url
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

        // Make extension running <-- ESSENTIAL
        await chrome.storage.local.set({
            [STORAGE_KEYS.RUNNING]: true
        })

        // Redirect to the first video
        await chrome.tabs.update(tabs[0].id, { url: start_url })
    }


    /**
     * Extracts all video's url from configuration
     * @returns {Array} Array of all experiment's videos' urls
    */
    const get_experiment_urls = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const urls = []
        for (const video of configuration.videos) {
            urls.push(video.url)
        }
        return urls
    }


    return {
        handleClick
    }
}




export default useStartExperiment