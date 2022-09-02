export const set_bitrate = (override_button, select, bitrate) => {
    select.value = bitrate
    override_button.click()
}