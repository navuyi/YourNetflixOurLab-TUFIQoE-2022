from xml.dom.expatbuilder import parseString
from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("experiment", __name__, url_prefix="/experiment")

# Configure test path


@bp.route('/', methods=["POST"])
def set_experiment():
    data = request.json

    insert = dict(
        started=data["started"],
        device_id=data["device_id"],
        experiment_type=data["experiment_type"],
        video_limit=data["video_limit"],
        tester_id=data["tester_id"],
        configuration=data["configuration"],
        urls=json.dumps(data["urls"])
    )
    # Create experiment
    cursor().execute(f"""INSERT INTO experiment (started, device_id, experiment_type, video_limit, tester_id, configuration, urls) 
    VALUES (:started, :device_id, :experiment_type, :video_limit, :tester_id, :configuration, :urls)""", insert)

    experiment_id = lastrowid()
    return jsonify(dict(experiment_id=experiment_id)), 201


@bp.route("/", methods=["GET"])
def get_experiment():
    return {"msg": "OK EXPERIMENT GET"}, 200
