import React, { useEffect } from "react";
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage";
import Loader from "../../Components/Loader/Loader";
import { useResumeExperiment } from "./useResumeExperiment";
import style from "./style.module.scss"


const ExperimentBreak = () => {
    const {enabled, init, handle_experiment_resume, resuming} = useResumeExperiment(2)
    
    useEffect(() => {
       init()
    }, [])

    return(
        <div className={style.experiment_break}>
            <div className={style.wrapper}>
                <span className={style.header}>Przerwa pomiędzy odcinkami</span>
                <span className={style.counter_label}>Możliwość kontynuacji za chwilę</span>
               {
                !enabled ? <Loader /> : 
                <>
                    {
                        resuming ? <Loader /> : <button onClick={handle_experiment_resume} className={style.resume_button}>Kontynuuj</button>
                    }
                </>
               }
            </div>
        </div>
    )
}

export default ExperimentBreak