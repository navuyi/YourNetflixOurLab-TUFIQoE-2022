from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("playback_data", __name__, url_prefix="/playback_data")

# Configure test path


@bp.route('/', methods=["POST"])
def add_playback_data():
    data = request.json
    video_id = request.json["video_id"]

    insert = dict(
        video_id=data["video_id"], buffering_bitrate_audio=data["buffering_bitrate_audio"], buffering_bitrate_video=data["buffering_bitrate_video"],
        buffering_state=data["buffering_state"], buffering_vmaf=data["buffering_vmaf"], duration=data["duration"],
        framerate=data["framerate"], player_state=data["player_state"], playing_bitrate_video=data["playing_bitrate_video"],
        playing_bitrate_audio=data["playing_bitrate_audio"], playing_vmaf=data["playing_vmaf"], position=data["position"],
        rendering_state=data["rendering_state"], resolution=data["resolution"], segment_position=data["segment_position"],
        timestamp=data["timestamp"], total_corrupted_frames=data["total_corrupted_frames"], total_dropped_frames=data["total_dropped_frames"],
        total_frames=data["total_frames"], volume=data["volume"], bitrate=data["bitrate"]
    )

    cursor().execute(f"""INSERT INTO playback_data 
        (video_id, buffering_bitrate_audio, buffering_bitrate_video,
        buffering_state, buffering_vmaf, duration,
        framerate, player_state, playing_bitrate_video,
        playing_bitrate_audio, playing_vmaf, position,
        rendering_state, resolution, segment_position,
        timestamp, total_corrupted_frames, total_dropped_frames,
        total_frames, volume, bitrate)
        VALUES 
        (:video_id, :buffering_bitrate_audio, :buffering_bitrate_video,
        :buffering_state, :buffering_vmaf, :duration,
        :framerate, :player_state, :playing_bitrate_video,
        :playing_bitrate_audio, :playing_vmaf, :position,
        :rendering_state, :resolution, :segment_position,
        :timestamp, :total_corrupted_frames, :total_dropped_frames,
        :total_frames, :volume, :bitrate)
    """, insert)

    return jsonify(dict(msg="OK")), 201
