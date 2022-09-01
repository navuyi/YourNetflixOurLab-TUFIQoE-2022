import React from "react";
import { Form } from "react-bootstrap";


const ConfigFileInput = (props) => {

    return (
        <>
            <Form.Group>
                <Form.Label style={{ color: "whitesmoke" }} >Provide JSON file with bitrate configuration</Form.Label>
                <Form.Control onChange={props.read_data_from_file} type="file" style={{ width: "70%" }} accept=".json" />
            </Form.Group>
        </>
    )
}




export default ConfigFileInput