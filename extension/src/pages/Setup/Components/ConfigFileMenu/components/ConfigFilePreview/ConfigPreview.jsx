import React from "react";
import styles from "./style.module.css"
import Separator from "../Separator/Separator";
import VideoSummaryItem from "../VideoSummaryItem/VideoSummaryItem";

const ConfigPreview = (props) => {



    return (
        <>
            <h1 className={styles.header}>Videos configuration summary</h1>
            {
                props.json_object.videos ?
                    props.json_object?.videos.map((video, index) => {
                        return (
                            <div key={index}>
                                <VideoSummaryItem

                                    video={video}
                                    index={index}
                                />
                                {
                                    props.json_object.videos.length - 1 === index ? null : <Separator />
                                }
                            </div>
                        )
                    }) : null
            }
        </>
    )
}




export default ConfigPreview