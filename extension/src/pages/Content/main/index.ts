import {AssessmentManager} from "./modules/AssessmentManager"
import QualityScenarioManager from "./modules/QualityScenarioManager";
import {CustomPlayer} from "./modules/CustomPlayer";
import { DebugMenuAnalyzer } from "./modules/DebugMenuAnalyzer";

const init = async () => {
    inject_netflix_controls_script()

    const debugAnalyzer = new DebugMenuAnalyzer()
    await debugAnalyzer.init()

    const customPlayer = new CustomPlayer()
    await customPlayer.init()

    const qualityScenarioManager = new QualityScenarioManager()
    await qualityScenarioManager.init()

    const assessmentManager = new AssessmentManager()
    await assessmentManager.init()
}

const inject_netflix_controls_script = () => {
    const s = document.createElement("script")
    s.src = chrome.runtime.getURL("netflixControls.bundle.js");

    (document.head || document.documentElement).appendChild(s);
    s.remove()
}

init()












