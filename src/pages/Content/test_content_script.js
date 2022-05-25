import {STORAGE_KEYS} from "../config"
import {get_local_datetime} from "../../utils/time_utils"
import {save_json} from "../../utils/save_json"

console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")
console.log("EMERGENCY FILE SAVE!!!!!!!")



const init = async () => {
    // Save data as json file
    const res = await chrome.storage.local.get([
      STORAGE_KEYS.DATA_TO_SAVE,
      STORAGE_KEYS.ARCHIVE_TO_SAVE,
      STORAGE_KEYS.ASSESSMENTS_TO_SAVE,
      STORAGE_KEYS.DEVICE_ID,
      STORAGE_KEYS.SESSION_TYPE,
      STORAGE_KEYS.EPISODES_LIMIT,
      STORAGE_KEYS.EPISODES_URL,
      STORAGE_KEYS.TESTER_ID,
      STORAGE_KEYS.EPISODE_COUNT
    ])
    const data = res[STORAGE_KEYS.DATA_TO_SAVE]
    const archive = res[STORAGE_KEYS.ARCHIVE_TO_SAVE]
    const assessments = res[STORAGE_KEYS.ASSESSMENTS_TO_SAVE]

    console.log(data)
    console.log(archive)
    console.log(assessments)
    
    const episode_limit = parseInt(res[STORAGE_KEYS.EPISODES_LIMIT])
    const episode_count = parseInt(res[STORAGE_KEYS.EPISODE_COUNT])
    const episode_index = episode_count - 1

    // Complete data
    const results = {
      info: {
        device_id: res[STORAGE_KEYS.DEVICE_ID],
        session_type: res[STORAGE_KEYS.SESSION_TYPE],
        episodes_limit: res[STORAGE_KEYS.EPISODES_LIMIT],
        episode_index: episode_index,
        episode_url: res[STORAGE_KEYS.EPISODES_URL][episode_index],
        tester_id: res[STORAGE_KEYS.TESTER_ID]
      },
      assessments: assessments,
      data: data
    }

    // Save files
    const timestamp = get_local_datetime(new Date())
    const results_filename = `results_${results.info.tester_id}_${results.info.session_type}_${timestamp}.json`;  
    const archive_filename = `archive_${results.info.tester_id}_${results.info.session_type}_${timestamp}.json`;  
   
    const results_json = save_json(results, results_filename)
    setTimeout(() => {
        const archive_json = save_json(archive, archive_filename)
    }, 2000)
}


init()