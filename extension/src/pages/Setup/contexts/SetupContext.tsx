import React, { Children } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";
import { T_SETUP_CONTEXT } from "./types";


const SetupContext = createContext<T_SETUP_CONTEXT>({
    urls: [],
    mappingAvailable: false,
    experimentAvailable: false,
    setUrls: () => {},
    setMappingAvailable: () => {},
    setExperimentAvailable: () => {}
})

export const useSetupContext = () => useContext(SetupContext)


const SetupProvider: React.FC = ({children}) => {
    const [urls, setUrls] = useState([])
    const [mappingAvailable, setMappingAvailable] = useState(false)
    const [experimentAvailable, setExperimentAvailable] = useState(false)

    const contextValue = {
        urls,
        mappingAvailable,
        experimentAvailable,
        setUrls, setMappingAvailable, setExperimentAvailable
    }

    return(
        <SetupContext.Provider value={contextValue}>
            {children}
        </SetupContext.Provider>
    )
}

export default SetupProvider