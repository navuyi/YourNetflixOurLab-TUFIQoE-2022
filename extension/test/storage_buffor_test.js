import { ARCHIVE_DEFAULT, DATABASE_DEFAULT, STORAGE_KEYS } from "../src/pages/config";
import { get_local_datetime } from "../src/utils/time_utils";
import { database_chunk, archive_chunk } from "./dummy_data";



/**
 * 
 * The idea is to save collected data to chrome.storage every N inserts
 *  
**/
export const test_storage_with_buffor = () => {
    const local_database = DATABASE_DEFAULT
    const local_archive = ARCHIVE_DEFAULT
    let data_count = 0
    let index = 0

    const CUTOFF = 100
    const LIMIT = 5000
    const INTERVAL = 100

    const logs = []

    const interval = setInterval(async () => {
        console.log(await chrome.storage.local.get([STORAGE_KEYS.DATA_TO_SAVE, STORAGE_KEYS.ARCHIVE_TO_SAVE]))

        if(data_count >= CUTOFF){
            await save_data_to_storage(local_database, local_archive, logs)
            data_count = 0
        }
        if(index >= LIMIT){
            await save_data_to_storage(local_database, local_archive, logs)
            clearInterval(interval)
            console.log(logs)
            return
        }

        for(let key in local_database){
            local_database[key].push(database_chunk[key])
        }
        for(let key in local_archive){
            local_archive[key].push(archive_chunk[key])
        }


        data_count+=1
        index+=1
    }, INTERVAL)

}

const save_data_to_storage = async (database, archive, logs) => {
    console.log("Saving data to chrome.storage")
    const start = new Date()
    await chrome.storage.local.set({
        [STORAGE_KEYS.DATA_TO_SAVE]: database,
        [STORAGE_KEYS.ARCHIVE_TO_SAVE]: archive
    })
    const log = `${get_local_datetime(new Date())} - Saving took: ${new Date() - start}ms || Arrays length: ${archive.timestamp.length}`
    logs.push(log)
    console.log(log)
}