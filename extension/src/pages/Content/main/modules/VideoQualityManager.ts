import { CustomLogger } from "../../../../utils/custom/CustomLogger";


import {T_SCENARIO_ITEM } from "../../../../config/types/data-structures.type";
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage";

export class VideoQualityManager {
    private scenario : T_SCENARIO_ITEM[] | undefined
    private bitrate_interval : number | undefined
    private iterator : Iterator<T_SCENARIO_ITEM> | undefined
    private logger : CustomLogger

    constructor(){
        this.logger = new CustomLogger("[VideoQualityManager]")
    }

    async init(){
        this.scenario = await this.prepare_video_scenario()
        this.bitrate_interval = await this.prepare_bitrate_interval()

        this.iterator = this.scenario_iterator()

        // Start bitrate changes
        // TODO
    }

    /**
     *  Method reads bitrate changes interval from config file. Provided in seconds has to be converted to ms.
    */
    async prepare_bitrate_interval() {
        const settings = await ChromeStorage.get_experiment_settings()
        const configuration = settings.config
        const interval_s = configuration?.bitrate_interval // <-- interval from config file, given in seconds

        if (interval_s != null && typeof (interval_s) == 'number') {
            this.logger.log(`Configuration's bitrate change interval - OK, ${interval_s}s = ${this.bitrate_interval}ms`)
            return 1000 * interval_s
        } else {
            this.logger.log(`Configuration's bitrate change interval missing or incorrect. Using default interval`)
            return settings.bitrate_interval_ms
        }
    }

    /**
     *  Method prepares scenario for current video.
     *  Fetches configuration from chrome.storage.
    */
    private prepare_video_scenario = async () : Promise<T_SCENARIO_ITEM[] | undefined> => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()

        return settings.config?.videos[variables.video_index].scenario
    }

    /**
     * Yields scenario's items in loop
     */
    * scenario_iterator() {
        let index = 0;
        if(this.scenario != null){
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
}

export default VideoQualityManager