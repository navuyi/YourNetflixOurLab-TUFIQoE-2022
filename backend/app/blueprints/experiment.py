from flask import Blueprint, request, jsonify
from app.db import cursor


bp = Blueprint("experiment", __name__, url_prefix="/experiment")

# Configure test path
@bp.route('/', methods=["POST"])
def set_experiment():
    data = request.json
    print(data)
    return jsonify(data), 201



@bp.route("/", methods=["GET"])
def get_experiment():
     return {"msg": "OK EXP GET"}, 200