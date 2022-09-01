import { EXTENSION_MODE_AVAILABLE, STORAGE_DEFAULT, STORAGE_KEYS } from "../../../../config"


const useStartMappingButton = () => {


    const handleClick = async () => {
        await set_mode_to_mapping()
        await set_extension_running()
        await redirect_to_first_video()
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
        const first_episode = config.episodes[0]

        // Redirect to 
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        await chrome.tabs.update(tabs[0].id, { url: first_episode.url })
    }

    return {
        handleClick
    }
}

export default useStartMappingButton