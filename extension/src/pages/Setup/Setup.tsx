import React, { useLayoutEffect } from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';
import URLInput from './components/URLInput/URLInput';




const Setup = () => {

  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
          <h1 className={style.header}>Your Netflix Our Lab Experiment</h1>  
          <URLInput />
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