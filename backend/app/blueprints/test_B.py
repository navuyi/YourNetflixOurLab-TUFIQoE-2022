from flask import Blueprint


bp = Blueprint("test_B", __name__, url_prefix="/test_B")

# Configure test path
@bp.route('/', methods=["GET"])
def test_B():
    return {"msg": "OK TEST_B"}, 200