import { Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { CountActions, IDecrementCountAction, IIncrementCountAction } from "../redux/actions/countActions"
import { AppState } from "../redux/reducers"

import { NameActions } from "../redux/actions/nameActions"
import { AnyAction } from "redux"



export const useButton = () => {
    const {count} = useSelector((state:AppState) => state.count)
    
    const countDispatch = useDispatch<Dispatch<CountActions>>();
  

    const handle_count_increase = () => {
        console.log(count)
        countDispatch({type: "INCREMENT"})
    }

    const handle_count_decrease = () => {
        console.log(count)
        countDispatch({type: "DECREMENT"})
    }

    return{
        handle_count_increase,
        handle_count_decrease
    }
}