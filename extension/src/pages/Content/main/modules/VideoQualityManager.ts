import { CustomLogger } from "../../../../utils/custom/CustomLogger";
import {T_SCENARIO_ITEM } from "../../../../config/types/data-structures.type";
import { ChromeStorage } from "../../../../utils/custom/ChromeStorage";
import { wait_for_video_to_load } from "../../../../utils/waiters/wait_for_video_to_load";
import { NetflixBitrateMenu } from "../../../../utils/netflix/NetflixBitrateMenu";
import { NetflixPlayerAPI } from "../../../../utils/netflix/NetflixPlayerAPI";

export class VideoQualityManager {
    private scenario : T_SCENARIO_ITEM[] | undefined
    private bitrate_interval : number | undefined
    private iterator : Iterator<T_SCENARIO_ITEM> | undefined
    private logger : CustomLogger

    constructor(){
        this.logger = new CustomLogger("[VideoQualityManager]")
    }

    public init = async () : Promise<void> => {
        await wait_for_video_to_load()
        
        this.scenario = await this.prepare_video_scenario()
        this.bitrate_interval = await this.prepare_bitrate_interval()
        this.iterator = this.scenario_iterator()

        await this.set_bitrate() // <-- set first bitrate
        await this.reset_playback() // <-- reset video, rewind to beginning in order to apply set bitrate
        NetflixPlayerAPI.set_video_muted(false) // <-- unmute video, could be muted because of previous mapping
        
        // Set another bitrate and start cyclic bitrate changes after some delay
        setTimeout(async () => {
            await this.set_bitrate()

            // Start cyclic bitrate changes
            setInterval(async () => {
                await this.set_bitrate()
            }, this.bitrate_interval)
        }, 10e3)
    }

    /**
     *  Returns bitrate interval
    */
    private prepare_bitrate_interval = async () : Promise<number> => {
        const settings = await ChromeStorage.get_experiment_settings()
        return settings.bitrate_interval_ms
    }

    /**
     *  Method prepares scenario for current video.
     *  Fetches configuration from chrome.storage.
    */
    private prepare_video_scenario = async () : Promise<T_SCENARIO_ITEM[] | undefined> => {
        const settings = await ChromeStorage.get_experiment_settings()
        const variables = await ChromeStorage.get_experiment_variables()

        return settings.videos[variables.video_index].scenario
    }

    private set_bitrate = async () : Promise<void> => {
        if(this.iterator == null) return;

        const settings = this.iterator.next().value
        this.logger.log(`Setting bitrate to ${settings.bitrate}kbps which corresponds to VMAF ${settings.vmaf}`)
        this.logger.log(`VMAF template was ${settings.vmaf_template}. Difference: ${settings.vmaf_diff}`)

        await NetflixBitrateMenu.set_bitrate(settings.bitrate)
    }

    private reset_playback = async () : Promise<void> => {
        const video_duration = NetflixPlayerAPI.get_video_duration()
        NetflixPlayerAPI.seek(Math.round(video_duration/2)) 
        NetflixPlayerAPI.seek(Math.round(video_duration/4)) 
        NetflixPlayerAPI.seek(0)                            // seek to the beginning of the video
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