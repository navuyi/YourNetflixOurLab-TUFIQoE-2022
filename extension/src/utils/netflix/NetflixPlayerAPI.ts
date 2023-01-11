import { CustomLogger } from "../custom/CustomLogger"
import { netflix_api_elements } from "../../config/netflix-player_api"

export class NetflixPlayerAPI{
    private static logger = new CustomLogger("[NetflixPlaybackController]")

    public static seek = (position : number) => {
        const seek_element = netflix_api_elements.seek.get()
        seek_element?.setAttribute(netflix_api_elements.seek.attribute, position.toString())
        seek_element?.click()        
    } 

    public static get_current_time = () : number => {
        const current_time_element = netflix_api_elements.current_time.get()
        current_time_element?.click()
        return Number(current_time_element?.getAttribute(netflix_api_elements.current_time.attribute))
    }

    public static get_video_duration = () : number => {
        const duration_element = netflix_api_elements.duration.get()
        duration_element?.click()
        return Number(duration_element?.getAttribute(netflix_api_elements.duration.attribute))
    }





    public static pause_video = () : void => {
        const video = NetflixPlayerAPI.get_html_video_element()
        if(video != null){
            video.pause()
        }
    }

    public static resume_video = async () : Promise<void> => {
        const video = NetflixPlayerAPI.get_html_video_element()
        if(video != null){
            await video.play()
        }
    }

    public static hide_video_player = () : void => {
        const video = NetflixPlayerAPI.get_html_video_element()
        if(video != null){
            video.style.visibility = "hidden"
            video.style.pointerEvents = "none"
        }
    }

    public static reveal_video_player = () : void => {
        const video = NetflixPlayerAPI.get_html_video_element()
        if(video != null){
            video.style.visibility = "visible"
            video.style.pointerEvents = "auto"
        }
    }

    public static set_video_muted = (muted : boolean) : void => {
        const video = NetflixPlayerAPI.get_html_video_element()
        if(video != null){
            video.muted = muted
        }
    }


    public static get_html_video_element = () : HTMLVideoElement | null => {
        const video = document.getElementsByTagName("video")[0]
        return video != null ? video : null
    }
}