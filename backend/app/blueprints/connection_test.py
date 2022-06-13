from xml.dom.expatbuilder import parseString
from flask import Blueprint, request, jsonify
from app.db import cursor
import json

from app.db import lastrowid

bp = Blueprint("connection_test", __name__, url_prefix="/connection_test")

# Configure test path


@bp.route('/', methods=["GET"])
def test_connection():
    return jsonify(dict(msg="Connection OK. Flask OK.")), 200
