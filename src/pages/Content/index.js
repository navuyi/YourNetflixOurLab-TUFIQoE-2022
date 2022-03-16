import { analyze_data } from "./modules/analyze_data"
import { get_statistics_element } from "./modules/get_statistics_element"



const init = async () => {
    console.log("Hello World" + Math.random()*100)
    const element = await get_statistics_element()

    setInterval(() => {
        analyze_data(element.value.toString())
    }, 250)
}




init()


