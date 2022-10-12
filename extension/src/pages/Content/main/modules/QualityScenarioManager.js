import { CONFIGURATION_KEYS, STORAGE_KEYS } from "../../../config";
import { BITRATE_INTERVAL } from "../../../config";
import { CustomLogger } from "../../../../utils/CustomLogger";
import BitrateController from "./BitrateController";
import {BitrateMenu} from "../../utils/BitrateMenu";

export class QualityScenarioManager {
    constructor() {
        // Episode's scenario
        this.scenario = undefined
        // Bitrate change interval - config file
        this.bitrate_interval = undefined
        // Custom logger
        this.logger = undefined
        // BitrateMenu instance
        this.bitrate_menu = undefined
        // Scenario iterator
        this.iterator = undefined
        // BitrateController instance
        this.bitrate_controller = undefined
    }


    async init(){
        this.bitrate_menu = new BitrateMenu()
        await this.bitrate_menu.init()

        this.logger = new CustomLogger("[QualityScenarioManager]")

        this.scenario = await this.prepare_video_scenario()

        this.bitrate_interval = await this.prepare_bitrate_interval()

        this.iterator = this.scenario_iterator()

        // Start bitrate changes
        this.bitrate_controller = new BitrateController(this.scenario, this.bitrate_interval, this.bitrate_menu, this.iterator)
        await this.bitrate_controller.init()
    }

    /**
     *  Method reads bitrate changes interval from config file. Provided in seconds has to be converted to ms.
     */
    async prepare_bitrate_interval() {
        const configuration = (await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION]))[STORAGE_KEYS.CONFIGURATION]
        const interval_s = configuration[CONFIGURATION_KEYS.BITRATE_INTERVAL]

        if (interval_s != null && typeof (interval_s) == 'number') {
            this.logger.log(`Configuration's bitrate change interval - OK, ${interval_s}s = ${this.bitrate_interval}ms`)
            return 1000 * interval_s
        } else {
            this.logger.log(`Configuration's bitrate change interval missing or incorrect. Using default interval`)
            return BITRATE_INTERVAL
        }
    }

    /**
     *  Method prepares scenario for current video.
     *  Fetches configuration from chrome.storage.
     */
    async prepare_video_scenario() {
        const storage = await chrome.storage.local.get([STORAGE_KEYS.CONFIGURATION, STORAGE_KEYS.VIDEO_COUNT])
        const configuration = storage[STORAGE_KEYS.CONFIGURATION]
        const video_count = storage[STORAGE_KEYS.VIDEO_COUNT]
        const video_index = video_count - 1

        return configuration[CONFIGURATION_KEYS.VIDEOS][video_index][CONFIGURATION_KEYS.VIDEO_KEYS.SCENARIO]
    }

    /**
     * Yields scenario's items in loop
     */
    * scenario_iterator() {
        let index = 0;
        while (true) {
            this.logger.log("Yielding...")
            this.logger.log(this.scenario[index])
            yield this.scenario[index]
            if (index >= this.scenario.length - 1) {
                index = 0
            } else {
                index += 1
            }
        }
    }
}

export default QualityScenarioManager