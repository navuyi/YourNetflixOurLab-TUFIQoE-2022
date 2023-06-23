import { STORAGE_DEFAULT, T_STORAGE } from "../../config/storage.config"
import { T_EXPERIMENT_SETTINGS, T_EXPERIMENT_VARIABLES } from "../../config/storage.config"
import { CustomLogger } from "./CustomLogger"

export abstract class ChromeStorage{
    private static logger : CustomLogger = new CustomLogger("ChromeStorage")

    public static initialize_default = async () : Promise<void> => {
        ChromeStorage.logger.log("Initializing default storage")
        await chrome.storage.local.set(STORAGE_DEFAULT)
    }

    public static set_single = async (key: string, data: any) : Promise<void>=> {
        await chrome.storage.local.set({
            [key]: data
        })
    }

    public static get_single = async (key : string) : Promise <any> => {
        const res = await chrome.storage.local.get([key])
        return res[key]
    }
    
    public static get_multiple = async (...keys : Array<string>) : Promise <object> => {
        return await chrome.storage.local.get([...keys])
    }


    // Experiment variables utils
    public static get_experiment_variables = async () : Promise<T_EXPERIMENT_VARIABLES> => {
        const experiment_variables = await ChromeStorage.get_single("experiment_variables")
        return experiment_variables
    }

    public static set_experiment_variables = async (variables : T_EXPERIMENT_VARIABLES) : Promise<void> => {
        await chrome.storage.local.set({experiment_variables: variables})
    }

    public static update_experiment_variables_property = async <T extends keyof T_EXPERIMENT_VARIABLES>(key:T, value:any) : Promise<void> => {
        const variables = await ChromeStorage.get_experiment_variables()
        variables[key] = value
        await ChromeStorage.set_experiment_variables(variables)
    }

    
    // Experiment settings utils
    public static get_experiment_settings = async () : Promise<T_EXPERIMENT_SETTINGS> => {
        const experiment_settings = await ChromeStorage.get_single("experiment_settings")
        return experiment_settings 
    }

    public static set_experiment_settings = async (settings : T_EXPERIMENT_SETTINGS) : Promise<void> => {
        await chrome.storage.local.set({experiment_settings: settings})
    }

    public static update_experiment_settings_property = async <T extends keyof T_EXPERIMENT_SETTINGS>(key:T, value:any) : Promise<void> => {
        const settings = await ChromeStorage.get_experiment_settings()
        settings[key] = value
        await ChromeStorage.set_experiment_settings(settings)
    }



}

