import React, { useLayoutEffect } from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';
import { ChromeStorage } from '../../utils/custom/ChromeStorage';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { useSelector } from 'react-redux';
import { T_APP_STATE } from './redux/reducers';




const Setup = () => {
 
  // Update before rendering
  useLayoutEffect(() => {
    const init = async () => {
      const settings = await ChromeStorage.get_experiment_settings()
  
    }
    init()
  }, [])


  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
          <h1 className={style.header}>YourNetflixOurLab Experiment</h1>  
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