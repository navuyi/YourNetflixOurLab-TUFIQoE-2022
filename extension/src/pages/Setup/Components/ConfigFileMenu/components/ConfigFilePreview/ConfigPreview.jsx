import React from "react";
import styles from "./style.module.css"
import Table from 'react-bootstrap/Table'

const ConfigPreview = (props) => {



    return (
        <>
            <h1 className={styles.header}>Episodes configuration preview</h1>
            {
                props.json_object.episodes ?
                    props.json_object?.episodes.map((episode, index) => {
                        return (
                            <div key={index} className={styles.summary_container}>
                                <h2 className={styles.summary_container_header}>Episode name: {episode?.name}</h2>
                                <p className={styles.summary_item}>Description: {episode?.description}</p>
                                <p className={styles.summary_item}>URL: <a href={episode?.url} className={styles.url}>{episode?.url}</a></p>
                                <p className={styles.summary_item}>vmaf_template: {JSON.stringify(episode?.vmaf_template)}</p>

                                <p className={styles.summary_item}>bitrate_available: {episode.bitrate ? JSON.stringify(episode.bitrate) : "[to be defined]"}</p>
                                <p className={styles.summary_item}>Bitrate {"<>"} VMAF map:</p>
                                {
                                    episode.bitrate_vmaf_map ? episode.bitrate_vmaf_map.map((item, index) => {
                                        return (
                                            <p key={index} className={styles.map_item}>Bitrate {item.bitrate} {"<---->"} {item.vmaf} VMAF</p>
                                        )
                                    }) : <span style={{ color: "red", margin: 0, fontWeight: 100 }}>To be defined</span>
                                }
                            </div>
                        )
                    }) : null
            }
        </>
    )
}




export default ConfigPreview