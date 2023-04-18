import React, { useLayoutEffect } from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';
import URLInput from './components/URLInput/URLInput';
import { useSelector } from 'react-redux';
import { T_APP_STATE } from './redux/reducers';


const Setup = () => {
  const setup = useSelector((state:T_APP_STATE) => state.setup)
  

  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
          <h1 className={style.header}>Your Netflix Our Lab Experiment</h1>  
          <URLInput />
          <MappingStartButton />
        </div>

        <div className={style.wrapper}>
          {
            setup.experimentAvailable ? <span className={style.configDetectedInfo}>Config detected. Experiment can be started</span> : null
          }
          <SubjectIDInput />
          <ExperimentStartButton />
        </div>
      </div>
    </div>
  )
};

export default Setup;