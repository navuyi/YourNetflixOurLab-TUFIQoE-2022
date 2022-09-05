import { useState } from "react";
import { create_experiment } from "../../../../../http_requests/create_experiment";
import { create_video } from "../../../../../http_requests/create_video";


import { STORAGE_KEYS } from "../../../../config";

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

    const validate_configuration = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        console.log(configuration)
        if (!("videos" in configuration)) {
            alert(`Configuration is lacking "videos" key`)
            return false
        }

        for (const video of configuration.videos) {
            if (!('scenario' in video)) {
                alert(`Video configuration is lacking scenario. Run Bitrate <-> VMAF mapping before starting experiment.`)
                return false
            }
        }

        return true
    }

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