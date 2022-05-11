import { StatsAnalyzer } from "./modules/StatsAnalyzer"
import {BitrateManager} from "./modules/BitrateManager";
import {AssessmentManager} from "./modules/AssessmentManager";

const init = async () => {
    const statsAnalyzer = new StatsAnalyzer()
    await statsAnalyzer.init()

    const bitrateManager = new BitrateManager()
    await bitrateManager.init()

    const assessmentManager = new AssessmentManager()
    await assessmentManager.init()


}


init()












