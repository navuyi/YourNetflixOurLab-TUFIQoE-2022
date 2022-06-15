import React from "react";


const ContinueHeader = (props) => {

    const style = {
        fontSize: "32px",
        marginTop: "0px"
    }


    return(
        <>
            <h1 style={style}> Teraz można zrobić krótką przerwę. </h1>
            <h1 style={style}> Proszę kontynuować w dowolnym momencie. </h1>
        </>
    )
}


export default ContinueHeader