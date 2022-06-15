import { ARCHIVE_DEFAULT, DATABASE_DEFAULT, STORAGE_KEYS } from "../src/pages/config"
import { get_local_datetime } from "../src/utils/time_utils"

export const test_chrome_storage = async () => {
    console.log("Hello world")
    const limit = 5242880

    const local_database = DATABASE_DEFAULT
    const local_archive = ARCHIVE_DEFAULT
    
    const dummy_data = {
        buffering_bitrate_audio: "96",
        buffering_bitrate_video: "2827",
        buffering_state: "Normal",
        buffering_vmaf: "95",
        duration: "2647.853",
        framerate: "23.976",
        player_state: "Normal",
        playing_bitrate_audio: "2827",
        playing_bitrate_video: "2827",
        playing_vmaf: "95",
        position: "6322.827",
        rendering_state: "Playing",
        resolution: "1920x1080",
        segment_position: "1741.092",
        timestamp: "2022-05-16T18:51:00.022",
        total_corrupted_frames: "0",
        total_dropped_frames: "3",
        total_frames: "1500",
        volume: "89"
    }
    

    const archive_chunk = "Version: 6.0033.414.911\nEsn: NFCDCH-02-J3YKFKYQ9UKM5YLY16XD9VKW219CJP\nPBCID: 6.Ap29sOA9vrOMhnOFJ9wjVVJ-nVL_ibg6D2z1Z9kkuwg\nUserAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36\n\nMovieId: 80025316\nTrackingId: 254743534\nXid: 165271985420477250 (165271985420477250)\nPosition: 11.001\nDuration: 2647.853\nPlayerDuration: 2647.853\nVolume: 89%\nSegment Position: 11.001\nSegment: 80025316:main\n\nPlayer state: Normal\nBuffering state: Normal\nRendering state: Waiting for decoder\n\nPlaying bitrate (a/v): 96 / 2827 (1920x1080)\nPlaying/Buffering vmaf: 95/95\nBuffering bitrate (a/v): 96 / 2827\nBuffer size in Bytes (a/v): 0 / 0\nBuffer size in Bytes: 0\nBuffer size in Seconds (a/v): 49.003 / 32.667\nCurrent CDN (a/v): c003.krk001.orangepl.isp.nflxvideo.net, Id: 61902 / c005.krk001.orangepl.isp.nflxvideo.net, Id: 63457\n\nAudio Track: en, Id: A:2:1;2;en;1;0;, Channels: 2.0, Codec: audio/mp4; codecs=\"mp4a.40.5\" (he-aac)\nVideo Track: Codec: video/mp4;codecs=avc1.4d0028 (avchigh)\nTimed Text Track: pl, Profile: dfxp-ls-sdh, Id: T:2:0;1;pl;0;0;0;\n\nFramerate: 23.976\nCurrent Dropped Frames: \nTotal Frames: 0\nTotal Dropped Frames: 0\nTotal Corrupted Frames: 0\nTotal Frame Delay: undefined\nMain Thread stall/sec: DISABLED\nVideoDiag: readyState=1,currentTime=11.001,pbRate=1,videoBuffered=6.757,videoRanges=10.5105-17.267249,audioBuffered=17.536,audioRanges=10.496-28.031999,duration=2647.8535\nHDR support: false (disabled)\n\nThroughput: -1 kbps\n"
    const timestamp = "2022-05-16T18:50:59.022"

    const dummy_archive = {
        data: archive_chunk,
        timestamp: timestamp
    }

    await chrome.storage.local.set({
        [STORAGE_KEYS.ARCHIVE_TO_SAVE]: ARCHIVE_DEFAULT,
        [STORAGE_KEYS.DATA_TO_SAVE]: DATABASE_DEFAULT
    })

    // Prepare dataset
    for(let i=0; i<3000; i++){
        for(const key in local_database){
            local_database[key].push(dummy_data[key])
        }
        for(const key in local_archive){
            local_archive[key].push(dummy_archive[key])
        }
    }

    console.log(local_archive)
    console.log(local_database)
    


    const ITERATIONS = 50000
    let iterator = 0
    const interval = setInterval(async ()=>{
         /*
        for(const key in database){
        database[key].push(dummy_data[key])
        }

        archive.data.push(archive_chunk)
        archive.timestamp.push(timestamp)
        */
        
        //const res = await chrome.storage.local.get([STORAGE_KEYS.ARCHIVE_TO_SAVE, STORAGE_KEYS.DATA_TO_SAVE])
        //const data_to_save = res[STORAGE_KEYS.DATA_TO_SAVE]
        //const archive = res[STORAGE_KEYS.ARCHIVE_TO_SAVE]
        const start = new Date()
        for(const key in local_database){
            local_database[key].push(dummy_data[key])
        }
        local_archive.data.push(archive_chunk)
        local_archive.timestamp.push(get_local_datetime(new Date()))
        await chrome.storage.local.set({
            [STORAGE_KEYS.DATA_TO_SAVE]: JSON.stringify(local_database),
            [STORAGE_KEYS.ARCHIVE_TO_SAVE]: JSON.stringify(local_archive)
        })
        const end = new Date()
        console.log(end-start)
        console.log(local_database)
        console.log(local_archive)


        iterator+=1
        if(iterator > 2000){
            clearInterval(interval)
        }
    }, 500)
}





function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}