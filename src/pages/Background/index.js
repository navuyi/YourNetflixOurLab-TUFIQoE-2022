import {Controller} from "./modules/Controller"
import {Messenger} from "./modules/Messenger"

const experiment_data = {
    //TODO DEFINE THE EXPERIMENT_DATA OBJECT KEYS AND HOW IT WILL BE FILLED 
    experiment_data: {// This should be filled on controller init maybe or on signal received from popup --> when experiment starts!!!
        user_one_id: undefined,
        user_two_id: undefined,
        device_id: undefined, //etc..
    },
    playback_data: {
        first_type_data: [],
        second_type_data: [],
        third_type_data: [],
        timestamp: []
    },
    assessments: {
        value: [],
        timestamp: []
    }
}

console.log("[BackgroundScript] Hello World")
const controller = new Controller(data_array)
const messenger = new Messenger(data_array)

controller.init()
messenger.init()

/*
setInterval(()=>{
    console.log("Checking array")
    console.log(data_array)
}, 1000) 
*/






