from xml.dom.expatbuilder import parseString
from flask import Blueprint, request, jsonify
from app.db import cursor

bp = Blueprint("bitrate", __name__, url_prefix="/bitrate")

# Configure test path


@bp.route('/', methods=["POST"])
def set_bitrate():
    data = request.json

    insert = dict(
        video_id=data["video_id"],
        value=data["value"],
        previous=data["previous"],
        timestamp=data["timestamp"]
    )
    cursor().execute(f"""INSERT INTO bitrate (video_id, value, previous, timestamp) 
    VALUES (:video_id, :value, :previous, :timestamp)""", insert)

    return jsonify(dict(msg="Birtate change created")), 201
