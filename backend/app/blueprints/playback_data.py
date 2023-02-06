from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("playback_data", __name__, url_prefix="/playback_data")

# Configure test path


@bp.route('/', methods=["POST"])
def add_playback_data():
    playback_data = request.json["playback_data"]
    archive = request.json["archive"]
    video_id = request.json["video_id"]

    # Manage playback data processed by regular expressions
    insert = dict(
        video_id=video_id, buffering_bitrate_audio=playback_data["buffering_bitrate_audio"], buffering_bitrate_video=playback_data["buffering_bitrate_video"],
        buffering_state=playback_data["buffering_state"], buffering_vmaf=playback_data["buffering_vmaf"], duration=playback_data["duration"],
        framerate=playback_data["framerate"], player_state=playback_data["player_state"], playing_bitrate_video=playback_data["playing_bitrate_video"],
        playing_bitrate_audio=playback_data["playing_bitrate_audio"], playing_vmaf=playback_data["playing_vmaf"], position=playback_data["position"],
        rendering_state=playback_data["rendering_state"], resolution=playback_data["resolution"], segment_position=playback_data["segment_position"],
        timestamp=playback_data["timestamp"], total_corrupted_frames=playback_data["total_corrupted_frames"], total_dropped_frames=playback_data["total_dropped_frames"],
        total_frames=playback_data["total_frames"], volume=playback_data["volume"]
    )

    cursor().execute(f"""INSERT INTO playback_data 
        (video_id, buffering_bitrate_audio, buffering_bitrate_video,
        buffering_state, buffering_vmaf, duration,
        framerate, player_state, playing_bitrate_video,
        playing_bitrate_audio, playing_vmaf, position,
        rendering_state, resolution, segment_position,
        timestamp, total_corrupted_frames, total_dropped_frames,
        total_frames, volume)
        VALUES 
        (:video_id, :buffering_bitrate_audio, :buffering_bitrate_video,
        :buffering_state, :buffering_vmaf, :duration,
        :framerate, :player_state, :playing_bitrate_video,
        :playing_bitrate_audio, :playing_vmaf, :position,
        :rendering_state, :resolution, :segment_position,
        :timestamp, :total_corrupted_frames, :total_dropped_frames,
        :total_frames, :volume)
    """, insert)

    # Manage raw string with nerd statistics
    insert = dict(
        video_id=video_id,
        data=archive["data"],
        timestamp=archive["timestamp"]
    )
    cursor().execute(f"""INSERT INTO archive (video_id, data, timestamp) VALUES (:video_id, :data, :timestamp)""", insert)

    return jsonify(dict(msg="OK")), 201
