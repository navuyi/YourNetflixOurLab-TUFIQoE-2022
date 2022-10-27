import {StatsAnalyzer} from "./modules/StatsAnalyzer"
import {AssessmentManager} from "./modules/AssessmentManager"
import QualityScenarioManager from "./modules/QualityScenarioManager";
import {CustomPlayer} from "./modules/CustomPlayer";


const init = async () => {
    const statsAnalyzer = new StatsAnalyzer()
    await statsAnalyzer.init()

    const customPlayer = new CustomPlayer()
    await customPlayer.init()

    //const bitrateManager = new BitrateManager()
    //await bitrateManager.init()
    const qualityScenarioManager = new QualityScenarioManager()
    await qualityScenarioManager.init()

    const assessmentManager = new AssessmentManager()
    await assessmentManager.init()


}


init()












