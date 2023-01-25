import React from 'react';
import "./style.module.scss";
import style from "./setup.module.scss";
import Dropzone from './components/Dropzone/Dropzone';
import MappingStartButton from './components/MappingStartButton';
import ExperimentStartButton from './components/ExperimentStartButton';
import SubjectIDInput from './components/SubjectIDInput';

const Setup = () => {
  console.log(style)
  return(
    <div className={style.setup}>
      <div className={style.container}>
        <div className={style.wrapper}>
          <h1 className={style.header}>YourNetflixOurLab Experiment</h1>  
          <Dropzone 
          
          />
          <div className={style.config_info_box}>
            <ul>
              <li>url one</li>
              <li>url one</li>
              <li>url one</li>
            </ul>
          </div>
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