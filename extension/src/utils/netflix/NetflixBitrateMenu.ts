import { CustomLogger } from "../custom/CustomLogger"


export type T_BITRATE_MENU_ELEMENTS = {
    container: HTMLElement,
    override_button: HTMLButtonElement,
    reset_button: HTMLButtonElement,
    select: HTMLSelectElement,
    options: Array<HTMLOptionElement>,
    bitrate_values: Array<number>
}

export class NetflixBitrateMenu{
    private static logger : CustomLogger = new CustomLogger("[NetflixBitrateMenu]")

    /**
     * Blocking method!
     * Invokes Netflix's bitrate menu by calling repeatedly keybord event dispatch method
     * Resolves when bitrate menu is invoked
     * @returns {void}
    */
    private static invoke = async () : Promise<void> => {
        let interval : ReturnType<typeof setInterval>
        let attempt = 1
        return new Promise(resolve => {
            interval = setInterval(() => {
                NetflixBitrateMenu.logger.log(`Invoking bitrate menu. Attempt: ${attempt}`)
                NetflixBitrateMenu.dispatch_invoker_event()

                if(NetflixBitrateMenu.is_invoked() === true){
                    clearInterval(interval)
                    resolve()
                }
                attempt += 1
            }, 500)
       })
    }

    /**
     *  Method simulates keyboard keys click in order to invoke bitrate menu programatically 
    */
    public static dispatch_invoker_event = () : void => {
        NetflixBitrateMenu.logger.log("Dispatching keyboard event")
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

    /**
     * Method closes all invoked (opened) bitrate menus
     * Particularly useful at the end of an episode when bitrate menu can be doubled
     * @returns {void}
    */
    public static close_invoked = () : void => {
        const player_streams = Array.from(document.getElementsByClassName("player-streams"))
        if(player_streams.length > 0){
            for(const player_stream of player_streams){
                NetflixBitrateMenu.logger.log("Closing remaining bitrate menu")
                const override_button = Array.from(player_stream.querySelectorAll("button")).filter(btn => btn.innerText === "Override")[0]
                override_button.click()
            }
        }
    }

    /**
     * Method checks if bitrate menu is invoked
     * @returns {boolean}
    */
    public static is_invoked = () : boolean => {
        const player_streams = Array.from(document.getElementsByClassName("player-streams"))
        if(player_streams.length > 0 && player_streams[0] != null){
            NetflixBitrateMenu.logger.log("Bitrate menu invoked")
            return true
        }
        else{
            NetflixBitrateMenu.logger.log("Bitrate menu not invoked")
            return false
        }
    }

    /**
     * Blocking method. 
     * Resolves when particular html elements of bitrate menu are extracted
     * @returns {Promise<T_BITRATE_MENU_ELEMENTS>}
    */
    public static get_html_elements = async () : Promise <T_BITRATE_MENU_ELEMENTS> => {
        NetflixBitrateMenu.close_invoked()
        await NetflixBitrateMenu.invoke()

        // Note that this method should always return elements from 0-indexed player-streams container.
        // At the end of video there will be TWO bitrate menus invoked (second -  1-indexed is for the next video).
        const player_streams = document.getElementsByClassName("player-streams")[0] as HTMLElement // 0-indexed, menu for current video
        const container = player_streams.childNodes[0] as HTMLElement
        
        const bitrate_menu = container.childNodes[1] // contains bitrate select and options
        const select = bitrate_menu.childNodes[1] as HTMLSelectElement
        const options = Array.from(select.childNodes) as Array<HTMLOptionElement>
        const bitrate_values = options.map(option => Number(option.value))
        const reset_button = Array.from(player_streams.querySelectorAll("button")).filter(btn => btn.innerText === "Reset")[0]
        const override_button = Array.from(player_streams.querySelectorAll("button")).filter(btn => btn.innerText === "Override")[0]

        //const audio_menu = container.childNodes[0] // - audio bitrate menu
        //const cdn_menu = container.childNodes[2]  // - cdn menu

        return {
            container: container,
            override_button: override_button,
            reset_button: reset_button,
            select: select,
            options: options,
            bitrate_values: bitrate_values
        }
    }

    /**
     * Blocking method.
     * Waits for bitrate menu to be invoked and returns available bitrates.
     * @returns {Array<number>}
    */
    public static get_available_bitrates = async () : Promise<Array<number>> => {
        const {bitrate_values} = await NetflixBitrateMenu.get_html_elements()

        // Closing remaining bitrate menus
        this.close_invoked()
        return bitrate_values
    }

    /**
     * Blocking method.
     * Sets new bitrate in bitrate menu
     * @param value 
    */
    public static set_bitrate = async (value : number) : Promise<void> => {
        const {select, override_button} = await NetflixBitrateMenu.get_html_elements()
        select.value = value.toString()
        override_button.click()

        // Closing remaining menus after bitrate is set
        this.close_invoked()
    }
}







