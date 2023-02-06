import {AssessmentManager} from "./modules/AssessmentManager"
import {CustomPlayer} from "./modules/CustomPlayer";
import { DebugMenuAnalyzer } from "./modules/DebugMenuAnalyzer";
import VideoQualityManager from "./modules/VideoQualityManager";

const init = async () => {
    inject_netflix_controls_script()

    const debugAnalyzer = new DebugMenuAnalyzer()
    await debugAnalyzer.init()

    const customPlayer = new CustomPlayer()
    await customPlayer.init()

    const videoQualityManager = new VideoQualityManager()
    await videoQualityManager.init()

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












