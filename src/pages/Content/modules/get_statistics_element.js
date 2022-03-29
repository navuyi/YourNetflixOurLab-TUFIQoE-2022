import { STATS_INVISIBLE, STATS_UNCLICKABLE } from "../../config"

export const get_statistics_element = () => {
    return new Promise((resolve) => {
        let element = undefined
        let outer_element = undefined
        let timer = undefined

        timer = setInterval(() => {
            simulate_keyboard_events()
            element = document.getElementsByTagName("textarea")[0]
            outer_element = document.getElementsByClassName("player-info")[0]   // This is the element that contains X (exit) button

            if(element && outer_element){
                // Clear retry interval
                clearInterval(timer)
                // Make outer container invisible and unclickable based on config
                if(STATS_INVISIBLE === true){
                    outer_element.style.visibility = "hidden"
                }
                if(STATS_UNCLICKABLE === true){
                    outer_element.style.pointerEvents = "none"
                }
                
                // Return element containing data
                resolve(element)
            }
        }, 100)
    })
}



const simulate_keyboard_events = () => {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "D",
            altKey: true,
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            code: "KeyD",
            which: 68,
            cancelable: true,
            composed: true,
            keyCode: 68
        })
    )
}

