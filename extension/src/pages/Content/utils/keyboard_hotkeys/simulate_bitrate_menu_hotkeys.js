
export const simulate_bitrate_menu_hotkey = () => {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "S",
            altKey: true,
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            code: "KeyS",
            which: 83,
            cancelable: true,
            composed: true,
            keyCode: 83
        })
    )
}