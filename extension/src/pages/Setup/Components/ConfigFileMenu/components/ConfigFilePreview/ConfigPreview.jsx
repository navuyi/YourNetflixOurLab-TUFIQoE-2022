import React from "react";
import styles from "./style.module.css"
import Separator from "../Separator/Separator";
import EpisodeSummaryItem from "../EpisodeSummaryItem/EpisodeSummaryItem";

const ConfigPreview = (props) => {



    return (
        <>
            <h1 className={styles.header}>Episodes configuration summary</h1>
            {
                props.json_object.episodes ?
                    props.json_object?.episodes.map((episode, index) => {
                        return (
                            <div key={index}>
                                <EpisodeSummaryItem

                                    episode={episode}
                                    index={index}
                                />
                                {
                                    props.json_object.episodes.length - 1 === index ? null : <Separator />
                                }
                            </div>
                        )
                    }) : null
            }
        </>
    )
}




export default ConfigPreview