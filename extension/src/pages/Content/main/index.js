import {StatsAnalyzer} from "./modules/StatsAnalyzer"
import {BitrateManager} from "./modules/BitrateManager"
import {AssessmentManager} from "./modules/AssessmentManager"
import QualityScenarioManager from "./modules/QualityScenarioManager";


const init = async () => {
    const statsAnalyzer = new StatsAnalyzer()
    await statsAnalyzer.init()

    //const bitrateManager = new BitrateManager()
    //await bitrateManager.init()
    const qualityScenarioManager = new QualityScenarioManager()
    await qualityScenarioManager.init()

    const assessmentManager = new AssessmentManager()
    await assessmentManager.init()


    /*
        // It is possible to overload console.log function so that we can save every console.log message
        // Consider it
        
        const original_log = console.log // <-- assigning original console.log, later use original_log(txt)
        console.log = async (txt) => {
            original_log(txt)
            original_log("Hello World")
            const res = await axios.post(<backend/extension_log_url>, txt)
        }
    */
}


init()












