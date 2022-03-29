import { analyze_data } from "./modules/analyze_data"
import { get_statistics_element } from "./modules/get_statistics_element"

import { StatsRecorder } from "./modules/StatsRecorder"

const statsRecorder = new StatsRecorder()
statsRecorder.init()


const init = async () => {
    console.log("Hello World" + Math.random()*100)
    const element = await get_statistics_element()

    setInterval(() => {
        analyze_data(element.value.toString())
    }, 1000)


    const dzejson = {
        playback: [1,2,3,4,5,6,7,8],
        dude: ["a", "b", "c", "d", "f"],
        timestmap: [1,2,3,4,5,667,32,7,7,8,56,6]
    }
    //save_json(dzejson)

}

const save_json = function(obj) {
    const data = JSON.stringify(obj, null, 2);
    const blob = new Blob( [ data ], {
        type: 'application/json'
    });

    const url = URL.createObjectURL( blob );
    const link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'data.json' );
    const event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
}





