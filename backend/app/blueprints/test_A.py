from flask import Blueprint
from flask import redirect
import subprocess

bp = Blueprint("test_A", __name__, url_prefix="/test_A")

# Configure test path
@bp.route('/', methods=["GET"])
def test_A():
    #p = subprocess.call("open -a /Users/navuyi/mpv/mpv.app /Users/navuyi/Desktop/source.avi", shell=True)

    flags = "--cursor-autohide=0 --no-input-default-bindings --hwdec=auto --ontop"
    mpv_source_location = "/Users/navuyi/mpv/mpv.app/Contents/MacOS/mpv"
    p = subprocess.call(f"{mpv_source_location} {flags} /Users/navuyi/Desktop/source.avi", stdout=subprocess.PIPE, shell=True)

    return {"msg": "OK TEST_A"}, 200