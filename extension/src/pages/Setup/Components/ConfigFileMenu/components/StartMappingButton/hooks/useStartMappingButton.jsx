import { CONFIGURATION_KEYS, EXTENSION_MODE_AVAILABLE, STORAGE_DEFAULT, STORAGE_KEYS } from "../../../../../../config"


const useStartMappingButton = () => {


    const handleClick = async () => {
        const valid = await validate_configuration()
        if (valid) {
            await set_mode_to_mapping()
            await set_extension_running()
            await redirect_to_first_video()
        }
        else {
            alert("Check all required keys.")
        }
    }


    const validate_configuration = async () => {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        // Check for videos key in configuration
        if (!(CONFIGURATION_KEYS.VIDEOS in configuration)) {
            alert(`No "videos" in configuration!`)
            return false
        }
        // Check for url and vmaf_template
        for (const video of configuration[CONFIGURATION_KEYS.VIDEOS]) {
            // Check if keys exist
            if (!(CONFIGURATION_KEYS.VIDEO_KEYS.URL in video) || !(CONFIGURATION_KEYS.VIDEO_KEYS.VMAF_TEMPLATE_SCENARIO in video)) {
                alert(`"url" or "vmaf_template" missing in configuration!`)
                return false
            }
            // Check types
            else if (typeof (video[CONFIGURATION_KEYS.VIDEO_KEYS.URL]) !== 'string' || !Array.isArray(video[CONFIGURATION_KEYS.VIDEO_KEYS.VMAF_TEMPLATE_SCENARIO])) {
                alert(`"url" should be a string and vmaf_template_scenario an array of numbers!`)
                return false
            }
            // Check if values are not empty
            else if (video[CONFIGURATION_KEYS.VIDEO_KEYS.URL].length === 0 || video[CONFIGURATION_KEYS.VIDEO_KEYS.VMAF_TEMPLATE_SCENARIO].length === 0) {
                alert(`"url" and vmaf_template_scenario cannot be of length 0`)
                return false
            }
        }
        return true
    }


    const set_mode_to_mapping = async () => {
        await chrome.storage.local.set({
            [STORAGE_KEYS.EXTENSION_MODE]: EXTENSION_MODE_AVAILABLE.MAPPING
        })
    }

    const set_extension_running = async () => {
        await chrome.storage.local.set({
            [STORAGE_KEYS.RUNNING]: true
        })
    }

    const redirect_to_first_video = async () => {
        const config = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const first_video = config.videos[0]

        // Redirect to 
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        await chrome.tabs.update(tabs[0].id, { url: first_video.url })
    }

    return {
        handleClick
    }
}

export default useStartMappingButton