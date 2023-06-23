import { netflix_api_elements } from "../config/netflix_player_api";
/*
    Netflix player playback controls have to be established with HTML elements
    due to the separation of original page window object and the ContentScript.
    ContentScript has no access to the original page window's properties ! ! !
*/

const create_seek_element = () => {
    const element = document.createElement('div');
    element.id = netflix_api_elements.seek.id;
    element.onclick = (e) => {
        const new_time = Number(e.currentTarget.getAttribute(netflix_api_elements.seek.attribute)) * 1000
        const player = get_netflix_player()
        player.seek(new_time);
    }
    (document.body).appendChild(element);
}

const create_current_time_element = () => {
    const element = document.createElement("div")
    element.id = netflix_api_elements.current_time.id

    element.onclick = (e) => {
        const player = get_netflix_player()
        const current_time = Math.round(Number(player.getCurrentTime())) / 1000
        e.currentTarget.setAttribute(netflix_api_elements.current_time.attribute, current_time.toString())
    }
    (document.body).appendChild(element);
}

const create_duration_element = () => {
    const element = document.createElement("div")
    element.id = netflix_api_elements.duration.id

    element.onclick = (e) => {
        const player = get_netflix_player()
        const duration = Math.round(Number(player.getDuration())) / 1000
        e.currentTarget.setAttribute(netflix_api_elements.duration.attribute, duration.toString())
    }
    (document.body).appendChild(element)
}


/**
 * If executed in scope of original Neflix page (not content script) returns Netflix player object.
 * Player object failitates manipulation of video player - makes seeking available
 * Entire solution requires some boilerplate code.
 * @returns {player}
 */
const get_netflix_player = () => {
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);

    return player
}


create_seek_element()
create_current_time_element()
create_duration_element()

