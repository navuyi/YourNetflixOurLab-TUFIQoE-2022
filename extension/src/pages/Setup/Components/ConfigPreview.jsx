import React from "react";
import { Form } from "react-bootstrap";



const ConfigPreview = (props) => {

    const handleChange = (e) => {
        props.setConfig(e.target.value)
    }




    return (
        <>
            <Form.Group>
                <Form.Label style={{ color: "whitesmoke" }}>Configuration preview</Form.Label>
                <Form.Control as="textarea" style={{ width: "80%" }} rows={12} value={props.config} onChange={handleChange} />
            </Form.Group>
        </>
    )
}



export default ConfigPreview