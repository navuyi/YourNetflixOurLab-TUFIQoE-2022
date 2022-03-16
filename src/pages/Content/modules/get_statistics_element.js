
export const get_statistics_element = () => {
    return new Promise((resolve) => {
        let element = undefined
        let timer = undefined

        timer = setInterval(() => {
            simulate_keyboard_events()
            element = document.getElementsByTagName("textarea")[0]
            console.log("ASDASDASD")

            if(element){
                clearInterval(timer)
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

