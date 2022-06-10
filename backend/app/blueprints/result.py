from xml.dom.expatbuilder import parseString
from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint(
    "results", __name__, url_prefix="/results")

# Configure test path


@bp.route('/', methods=["GET"])
def get_results():
    cursor().execute(f"""SELECT * FROM experiment""")
    experiments_data = cursor().fetchall()
    result = []

    for experiment_data in experiments_data:
        experiment_id = experiment_data["id"]
        experiment = dict(
            info=experiment_data,
            video=[]
        )

        # Get video info +  playback data + assessments + bitrate changes
        cursor().execute(f"""SELECT * FROM video WHERE video.experiment_id={experiment["info"]["id"]}""")
        videos_data = cursor().fetchall()
        for video_data in videos_data:
            video_id = video_data["id"]
            # Get playback data
            cursor().execute(f"""SELECT * from playback_data WHERE video_id={video_id}""")
            playback_data = cursor().fetchall()
            video_data["playback_data"] = playback_data

            # Get assessment data
            cursor().execute(f"""SELECT * FROM assessment WHERE video_id={video_id}""")
            assessment = cursor().fetchall()
            video_data["assessment"] = assessment

            # Get bitrate data
            cursor().execute(f"""SELECT * FROM bitrate WHERE video_id={video_id}""")
            bitrate = cursor().fetchall()
            video_data["bitrate"] = bitrate

            # Append all data to the experiment
            experiment["video"].append(video_data)
        result.append(experiment)

    return jsonify(result), 201
