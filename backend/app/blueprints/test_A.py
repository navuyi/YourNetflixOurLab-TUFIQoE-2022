from flask import Blueprint


bp = Blueprint("test_A", __name__, url_prefix="/test_A")

# Configure test path
@bp.route('/', methods=["GET"])
def test_A():
    return {"msg": "OK TEST_A"}, 200