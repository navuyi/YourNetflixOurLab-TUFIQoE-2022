from time import time
from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("video", __name__, url_prefix="/video")

# Configure test path


@bp.route('/', methods=["POST"])
def set_video():
    data = request.json

    insert = dict(
        started=data["started"],
        experiment_id=data["experiment_id"],
        url=data["url"]
    )

    # Create experiment
    cursor().execute(f"""INSERT INTO video (started, experiment_id, url) 
    VALUES (:started, :experiment_id, :url)""", insert)

    video_id = lastrowid()

    return jsonify(dict(video_id=video_id)), 201


@bp.route("/", methods=["PATCH"])
def update_video():
    insert = dict(
        video_id=request.json["video_id"],
        ended=request.json["ended"]
    )
    cursor().execute(
        f"UPDATE video SET ended=:ended WHERE video.id=:video_id", insert)

    return jsonify(dict(msg="video updated")), 201
