import { useSelector } from "react-redux"
import { T_APP_STATE } from "../redux/reducers"
import { ChromeStorage } from "../../../utils/custom/ChromeStorage"
import { T_CONFIG } from "../../../config/types/data-structures.type"
import { useDispatch } from "react-redux"
import { Dispatch } from "redux"
import { T_CONFIG_ACTIONS } from "../redux/actions/configActions"
import Joi from 'joi';
import { getAllJSDocTagsOfKind, isJSDocOptionalType } from "typescript"


export const useConfig = () => {
    const config = useSelector((state:T_APP_STATE) => state.config)
    const configDispatch = useDispatch<Dispatch<T_CONFIG_ACTIONS>>()

    const save_config = async (config : T_CONFIG) => {
        // Update storage
        const settings = await ChromeStorage.get_experiment_settings()
        settings.config = config
        await ChromeStorage.set_experiment_settings(settings)
        // Update state
        const experiment_applicable = await is_config_experiment_applicable(config)
        const mapping_applicable = await is_config_mapping_applicable(config)
        configDispatch({
            type: "SET_EXPERIMENT_APPLICABLE",
            payload: experiment_applicable
        })
        configDispatch({
            type: "SET_MAPPING_APPLICABLE",
            payload: mapping_applicable
        })
        configDispatch({
            type: "SET_VALUE",
            payload: config
        })
    }

    const is_config_mapping_applicable = async (config : any) : Promise<boolean> => {
        const configSchema = Joi.object({
            title: Joi.string().allow("").required(),
            description: Joi.string().allow("").required(),
            assessment_interval: Joi.number().not(0).required(),
            bitrate_interval: Joi.number().greater(0).required(),
            videos: Joi.array().items(
                Joi.object({
                    name: Joi.string().allow("").required(),
                    description: Joi.string().allow("").required(),
                    url: Joi.string().pattern(/https:\/\/www.netflix.com\/watch\/[0-9]+.+/m).required(),
                    vmaf_template_scenario: Joi.array().min(1).items(Joi.number()).required(),
                    bitrate_vmaf_map: Joi.array().items(Joi.object({
                        vmaf: Joi.number().required(),
                        bitrate: Joi.number().required()
                    })).optional(),
                    scenario: Joi.array().items(Joi.object({
                        bitrate: Joi.number().required(),
                        vmaf: Joi.number().required(),
                        vmaf_diff: Joi.number().required(),
                        vmaf_template: Joi.number().required()
                    })).optional()
                })
            )
        })
        const {error} = configSchema.validate(config)
        if(error){
            console.log(error)
            console.log(error.cause)
            console.log(error.details)
            return false
        }else{
            return true
        }
    }

    const is_config_experiment_applicable = async (config : any) : Promise<boolean> => {
        const configSchema = Joi.object({
            title: Joi.string().allow("").required(),
            description: Joi.string().allow("").required(),
            assessment_interval: Joi.number().not(0).required(),
            bitrate_interval: Joi.number().greater(0).required(),
            videos: Joi.array().items(
                Joi.object({
                    name: Joi.string().allow("").required(),
                    description: Joi.string().allow("").required(),
                    url: Joi.string().pattern(/https:\/\/www.netflix.com\/watch\/[0-9]+.+/m).required(),
                    vmaf_template_scenario: Joi.array().min(1).items(Joi.number()).required(),
                    bitrate_vmaf_map: Joi.array().items(Joi.object({
                        vmaf: Joi.number().required(),
                        bitrate: Joi.number().required()
                    })).required(),
                    scenario: Joi.array().items(Joi.object({
                        bitrate: Joi.number().required(),
                        vmaf: Joi.number().required(),
                        vmaf_diff: Joi.number().required(),
                        vmaf_template: Joi.number().required()
                    })).required()
                })
            )
        })
        const {error} = configSchema.validate(config)
        if(error){
            console.log(error)
            console.log(error.cause)
            console.log(error.details)
            return false
        }else{
            return true
        }
    }


    return {
        save_config,
        is_config_experiment_applicable,
        is_config_mapping_applicable
    }
}