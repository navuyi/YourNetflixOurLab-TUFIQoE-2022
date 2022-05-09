import { StatsAnalyzer } from "./modules/StatsAnalyzer"
import {BitrateManager} from "./modules/BitrateManager";

const init = async () => {
    const statsAnalyzer = new StatsAnalyzer()
    await statsAnalyzer.init()

    const bitrateManager = new BitrateManager()
    await bitrateManager.init()
}


init()












