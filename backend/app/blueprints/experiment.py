from flask import Blueprint
from app.db import cursor

bp = Blueprint("experiment", __name__, url_prefix="/experiment")

# Configure test path
@bp.route('/', methods=["POST"])
def set_experiment():

    return {"msg": "OK TEST_A"}, 200




@bp.route("/", methods=["GET"])
def get_experiment():
     return {"msg": "OK TEST_A"}, 200