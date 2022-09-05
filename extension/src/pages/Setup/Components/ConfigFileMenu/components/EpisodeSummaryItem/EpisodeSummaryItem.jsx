import React from "react";
import styles from "./style.module.scss"
import Table from "react-bootstrap/Table"
import { CONFIGURATION_KEYS } from "../../../../../config";

const EpisodeSummaryItem = (props) => {

    const get_bitrate_scenario = () => {
        if (props.episode.scenario) {
            return JSON.stringify(Object.values(props.episode.scenario).map(item => item.bitrate))
        }
        else return "[TO BE DEFINED]"
    }
    const get_vmaf_scenario = () => {
        if (props.episode.scenario) {
            return JSON.stringify(Object.values(props.episode.scenario).map(item => item.vmaf))
        }
        else return "[TO BE DEFINED]"
    }


    return (
        <div key={props.index} className={styles.summary_container}>
            <h2 className={styles.summary_container_header}>Episode name: {props.episode?.name}</h2>
            <p className={styles.summary_item}><span className={styles.bolder}>Description: </span> {props.episode?.description}</p>
            <p className={styles.summary_item}><span className={styles.bolder}>URL: </span><a href={props.episode?.url} className={styles.url}>{props.episode?.url}</a></p>
            <p className={styles.summary_item}><span className={styles.bolder}>VMAF template scenario: </span> {JSON.stringify(props.episode[CONFIGURATION_KEYS.VMAF_TEMPLATE_SCENARIO])}</p>

            <p className={styles.summary_item} style={{ marginTop: "10px" }}><span className={styles.bolder}>Bitrate scenario: </span> {get_bitrate_scenario()}</p>
            <p className={styles.summary_item}><span className={styles.bolder}>VMAF scenario: </span> {get_vmaf_scenario()}</p>
            <p className={styles.summary_item}><span className={styles.bolder}>Bitrate --- VMAF map: </span></p>
            <div>
                {
                    props.episode.bitrate_vmaf_map ? props.episode[CONFIGURATION_KEYS.BITRATE_VMAF_MAP].map((item, index) => {
                        return (
                            <p key={index} style={{ color: "whitesmoke", margin: 0, fontWeight: 100 }}>{index + 1}. {item.bitrate} kbps --- {item.vmaf} VMAF</p>
                        )
                    }) : <span style={{ color: "red", margin: 0, fontWeight: 100 }}>To be defined</span>
                }
            </div>
        </div>
    )
}


/*

<Table bordered variant="dark" hover >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bitrate</th>
                        <th>VMAF</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.episode.bitrate_vmaf_map ? props.episode.bitrate_vmaf_map.map((item, index) => {
                            return (
                                <tr style={{ color: "whitesmoke" }}>
                                    <td>{index}</td>
                                    <td>{item.bitrate}</td>
                                    <td>{item.vmaf}</td>
                                </tr>
                            )
                        }) : <span style={{ color: "red", margin: 0, fontWeight: 100 }}>To be defined</span>
                    }
                </tbody>
            </Table>


*/


export default EpisodeSummaryItem