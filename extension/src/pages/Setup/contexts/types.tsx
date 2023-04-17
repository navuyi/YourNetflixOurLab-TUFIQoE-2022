import React from "react"

export type T_SETUP_CONTEXT = {
    urls: Array<string>
    mappingAvailable: boolean
    experimentAvailable: boolean
    setUrls: React.Dispatch<React.SetStateAction<Array<string>>>
    setMappingAvailable: React.Dispatch<React.SetStateAction<boolean>>
    setExperimentAvailable: React.Dispatch<React.SetStateAction<boolean>>
}