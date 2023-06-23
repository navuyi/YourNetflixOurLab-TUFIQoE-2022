from . video import bp as bp_video
from . experiment import bp as bp_experiment
from . playback_data import bp as bp_playback_data
from . assessment import bp as bp_assessment

from flask import Blueprint

from . result import bp as bp_result


bp = Blueprint('bp', __name__)

bp.register_blueprint(bp_experiment)
bp.register_blueprint(bp_video)
bp.register_blueprint(bp_playback_data)
bp.register_blueprint(bp_assessment)

bp.register_blueprint(bp_result)

