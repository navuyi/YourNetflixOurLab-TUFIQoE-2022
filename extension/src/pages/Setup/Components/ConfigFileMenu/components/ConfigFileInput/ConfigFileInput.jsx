import React from "react";
import { Form } from "react-bootstrap";
import styles from "./style.module.scss"

const ConfigFileInput = (props) => {

    return (
        <>
            <h1 className={styles.header}>Configuration file</h1>
            <Form.Group>
                <Form.Label style={{ color: "whitesmoke" }} >Provide JSON file with bitrate configuration</Form.Label>
                <Form.Control onChange={props.read_data_from_file} type="file" style={{ width: "70%" }} accept=".json" />
            </Form.Group>
        </>
    )
}




export default ConfigFileInput