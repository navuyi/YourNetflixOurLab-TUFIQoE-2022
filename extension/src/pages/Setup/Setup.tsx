import React, { useEffect } from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';
import URLInput from './components/URLInput/URLInput';
import { useSelector } from 'react-redux';
import { T_APP_STATE } from './redux/reducers';

import VideosEraseButton from './components/VideosEraseButton';


const Setup = () => {
  const setup = useSelector((state:T_APP_STATE) => state.setup)
  
  useEffect(() => {
    
  }, [])

  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
        <h1 className={style.header}>Your Netflix Our Lab Experiment</h1>  
          <span className={style.sub_header}>Setup</span>
          <span className={style.info_out}>Configuration status: <span className={style.info_in}>{setup.experimentAvailable ? "detected" : "not detected"}</span></span>
          {
            setup.experimentAvailable ? <span className={style.info_out}>Experiment may be started</span> : null
          }
          {
            setup.experimentAvailable ? <VideosEraseButton /> : null
          }
          <URLInput attributes={{disabled: setup.experimentAvailable}} />
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