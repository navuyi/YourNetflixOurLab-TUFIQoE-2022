import React, { useLayoutEffect } from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import Dropzone from './components/Dropzone/Dropzone';
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';
import { ChromeStorage } from '../../utils/custom/ChromeStorage';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { T_CONFIG_ACTIONS } from './redux/actions/configActions';
import { useSelector } from 'react-redux';
import { T_APP_STATE } from './redux/reducers';
import ConfigDetected from './components/ConfigDetected/ConfigDetected';
import { useConfig } from './hooks/useConfig';



const Setup = () => {
  const config = useSelector((state:T_APP_STATE) => state.config)
  const configDispatch = useDispatch<Dispatch<T_CONFIG_ACTIONS>>()
  
  const {is_config_experiment_applicable, is_config_mapping_applicable} = useConfig()
 
  // Update before rendering
  useLayoutEffect(() => {
    const init = async () => {
      const settings = await ChromeStorage.get_experiment_settings()
      const experiment_applicable = await is_config_experiment_applicable(settings.config)
      const mapping_applicable = await is_config_mapping_applicable(settings.config)

      configDispatch({
        type: "SET_VALUE",
        payload: settings.config
      })
      configDispatch({
        type: "SET_EXPERIMENT_APPLICABLE",
        payload: experiment_applicable
      })
      configDispatch({
        type: "SET_MAPPING_APPLICABLE",
        payload: mapping_applicable
      })
    }
    init()
  }, [])


  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
          <h1 className={style.header}>YourNetflixOurLab Experiment</h1>  
          {
            config.value != null ? <ConfigDetected /> : <Dropzone />
          }
          <MappingStartButton />
        </div>

        <div className={style.wrapper}>
          <SubjectIDInput />
          <ExperimentStartButton />
        </div>
      </div>
    </div>
  )
};

export default Setup;