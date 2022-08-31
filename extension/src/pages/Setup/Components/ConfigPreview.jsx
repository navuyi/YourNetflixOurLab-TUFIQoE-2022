import React from "react";
import { Form } from "react-bootstrap";



const ConfigPreview = (props) => {


    return (
        <>
            <Form.Group>
                <Form.Label style={{ color: "whitesmoke" }}>Configuration preview</Form.Label>
                <Form.Control as="textarea" style={{ width: "80%" }} rows={12} value={props.json_string} onChange={props.handle_preview_change} />
            </Form.Group>
        </>
    )
}



export default ConfigPreview