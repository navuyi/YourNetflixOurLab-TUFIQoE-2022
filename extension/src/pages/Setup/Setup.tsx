import React from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import Dropzone from './components/Dropzone/Dropzone';
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';

const Setup = () => {
  console.log(style)
  return(
    <div className={style.setup}>
      <div className={style.container}>
        <h1 className={style.header}>YourNetflixOurLab Experiment</h1>  
        <Dropzone 
        
        />
        

      <div className={style.btn_container}>
            <MappingStartButton />
            <ExperimentStartButton />
      </div>
      </div>
    </div>
  )
};

export default Setup;