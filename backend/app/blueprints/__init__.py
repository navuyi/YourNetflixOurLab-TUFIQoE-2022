from flask import Blueprint


bp = Blueprint('bp', __name__)


from . test_A import bp as test_A_bp
from . test_B import bp as test_B_bp

from . experiment import bp as bp_experiment

bp.register_blueprint(test_A_bp)
bp.register_blueprint(test_B_bp)
bp.register_blueprint(bp_experiment)