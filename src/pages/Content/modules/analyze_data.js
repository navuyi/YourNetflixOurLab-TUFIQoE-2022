import { get_local_datetime } from "../../../utils/time_utils"

export const analyze_data = (data) => {
    //TODO - make it to arrays format, so it takes less space
    //TODO - also continue with fetching more values 


    const result = {
        position: get_value("(Position:) ([0-9]+.[0-9]+)", 2, data),
        volume: get_value("(Volume:) ([0-9]+)(%)", 2, data),
        segment_position: get_value("(Segment Position:) ([0-9]+.[0-9]+)", 2, data),
        
        player_state: get_value("(Player state: )([a-zA-Z]+)", 2, data),
        buffering_state: get_value("(Buffering state: )([a-zA-Z]+)", 2, data),
        rendering_state: get_value("(Rendering state: )([a-zA-Z]+)", 2, data),
        
        timestamp: get_local_datetime(new Date())
    }
    console.log(result)
} 



const get_value = (regex, group, data) => {
    let value = null
    try{
        value = data.match(regex)[group] ?? null
    }
    catch(e){
        console.log(e)
    }
    return value
}











