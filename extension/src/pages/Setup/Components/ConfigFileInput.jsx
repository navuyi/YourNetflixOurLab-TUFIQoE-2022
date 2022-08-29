import React from "react";



import { Form } from "react-bootstrap";

const ConfigFileInput = (props) => {

    const file_reader = new FileReader()
    file_reader.onload = (e) => {
        const json_string = e.target.result
        props.setConfig(json_string)
    }


    const handleUpload = (e) => {
        file_reader.readAsText(e.target.files[0])
    }

    return (
        <>
            <Form.Group>
                <Form.Label style={{ color: "whitesmoke" }} >Provide JSON file with bitrate configuration</Form.Label>
                <Form.Control onChange={handleUpload} type="file" style={{ width: "70%" }} accept=".json" />

            </Form.Group>
        </>
    )
}




export default ConfigFileInput