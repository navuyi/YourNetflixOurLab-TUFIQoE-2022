from xml.dom.expatbuilder import parseString
from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("assessment", __name__, url_prefix="/assessment")

# Configure test path


@bp.route('/', methods=["POST"])
def set_assessment():
    data = request.json

    insert = dict(
        video_id=data["video_id"],
        value=data["value"],
        description=data["description"],
        started=data["started"],
        timestamp=data["timestamp"],
        duration=data["duration"]
    )
    cursor().execute(f"""INSERT INTO assessment (video_id, value, description, started, timestamp, duration) VALUES 
    (:video_id, :value, :description, :started, :timestamp, :duration)""", insert)

    return jsonify(dict(msg="Assessment created")), 201
