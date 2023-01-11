import { CustomLogger } from "../custom/CustomLogger";


export abstract class NetflixDebugMenu{
    private static logger : CustomLogger = new CustomLogger("[NetflixDebugMenu]")

    /**
     * Blocking method
     * @returns 
     */
    private static invoke = () : Promise<void> => {
        let interval : ReturnType<typeof setInterval>
        let attempt = 1
        return new Promise(resolve => {
            interval = setInterval(() => {
                NetflixDebugMenu.logger.log(`Invoking bitrate menu. Attempt: ${attempt}`)
                NetflixDebugMenu.dispatch_invoker_event()

                if(NetflixDebugMenu.is_invoked() === true){
                    clearInterval(interval)
                    resolve()
                }
                attempt += 1
            }, 500)
       })
    }

    private static dispatch_invoker_event = () : void => {
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

    /**
     * Non-blocking method. Returns true if DebugMenu is invoked or false if it is not.
     * @returns verdict
    */
    public static is_invoked = () => {
        const element = document.getElementsByTagName("textarea")[0]
        const outer_element = document.getElementsByClassName("player-info")[0] as HTMLElement  // This is the element that contains X (exit) button
    
        if([element, outer_element].some(elem => elem == null)){
            NetflixDebugMenu.logger.log("Not invoked!")
            return false
        }else{
            NetflixDebugMenu.logger.log("Invoked")
            outer_element.style.pointerEvents = "none" // <-- makes element unclickable
            element.style.pointerEvents = "none" // <-- makes element unclickable
            return true
        }
    }

    /**
     * Blocking method. Returns HTMLTextAreaElement of Netflix Debug Menu consisting 
     * information on video player state.
     * If debug menu is not invoked, method calls invoking method and waits for the element to be returned
     * @returns {element<HTMLTextAreaElement>}
    */
    public static get_html_element = async () : Promise<HTMLTextAreaElement> => {
        if(NetflixDebugMenu.is_invoked() === false){
            await NetflixDebugMenu.invoke()
        }

        const element = document.getElementsByTagName("textarea")[0]
        return element
    }
}