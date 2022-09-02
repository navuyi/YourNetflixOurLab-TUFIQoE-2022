
export const simulate_nerd_stats_hotkey = () => {
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