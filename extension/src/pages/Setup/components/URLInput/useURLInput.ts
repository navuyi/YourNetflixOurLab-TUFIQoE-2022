import { useDispatch } from "react-redux"
import { MouseEvent } from "react"
import { ChangeEvent } from "react"
import { useSelector } from "react-redux"
import { T_APP_STATE } from "../../redux/reducers"
import { T_SETUP_ACTIONS } from "../../redux/actions/setupActions"
import { Dispatch } from "redux"
import { useEffect } from "react"
import { useSetup } from "../../hooks/useSetup"
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage"
import { useLayoutEffect } from "react"

export const useURLInput = () => {
    const dispatch = useDispatch<Dispatch<T_SETUP_ACTIONS>>()
    const setup = useSelector((state:T_APP_STATE) => state.setup)
    const {validateMappingAvailable} = useSetup()

    useLayoutEffect(() => {
        const init = async () => {
            const settings = await ChromeStorage.get_experiment_settings()
            dispatch({
                type: "SET_SETUP", key: "urls", payload: settings.urls
            })
        }

        init()
    }, [])

    useEffect(() => {
        const updateStorage = async () => {
            await ChromeStorage.update_experiment_settings_property("urls", setup.urls)
        }
        updateStorage()
        validateMappingAvailable(setup.urls)
    }, [setup.urls])

    const handleChange = (e:ChangeEvent<HTMLInputElement>, index:number) => {
        const tmp = [...setup.urls]
        tmp[index] = e.currentTarget.value
        dispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }
    const handleDeleteUrl = (e:MouseEvent<HTMLDivElement>, index: number) => {
        const tmp = [...setup.urls]
        tmp.splice(index, 1)
        dispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }
    const handleAddUrl = () => {
        const tmp = [...setup.urls]
        tmp.push("")
        dispatch({
            type: "SET_SETUP", key: "urls", payload: tmp
        })
    }


    return {
        handleChange, handleDeleteUrl, handleAddUrl
    }
}