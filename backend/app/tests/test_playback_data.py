import json
from .utils import headers


def test_playback_data(client):
    # Test data
    playback_data = dict(
        video_id=69, buffering_bitrate_audio="965", buffering_bitrate_video="345",
        buffering_state="idk", buffering_vmaf="95", duration="3455.5",
        framerate="24", player_state="playing", playing_bitrate_video="13234",
        playing_bitrate_audio="3123123", playing_vmaf="54", position="123123",
        rendering_state="rendering", resolution="123x34213", segment_position="414124",
        timestamp="2022-05-30T12:09:54", total_corrupted_frames="0", total_dropped_frames="2",
        total_frames='423423', volume="80", bitrate="1602"
    )
    archive = dict(
        data="string data archive",
        timestamp="2022-05-30T12:09:54"
    )
    video_id = 1

    data = dict(
        playback_data=playback_data,
        archive=archive,
        video_id=video_id
    )

    # This works fine, just like the javascript object
    res = client.post("/playback_data/",
                      data=json.dumps(data), headers=headers)
    print(json.loads(res.data))
    assert res.status_code == 201
