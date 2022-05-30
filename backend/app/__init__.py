import os 
from flask import Flask
from flask_cors import CORS


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_mapping(
        SECRET_KEY="dev"
    )
    app.config['JSON_SORT_KEYS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = "../database/database.db"
    

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)



    # Check if instance directory exists
    try:
        os.makedirs(app.instance_path)
    except OSError as e:
        print(e)



    ### CORS Config ###
    config = {
        "ORIGINS": [
            "*",
            "chrome-extension://*"
        ]
    }
    cors = CORS(app, resources={r"/*": {"origins": config["ORIGINS"]}}, supports_credentials=True)


    # Import database methods
    from . db import db_init_app, db_before_request, cursor, db_get

    

    # Configure test path
    @app.route('/test', methods=["GET"])
    def test():
        return {"msg": "OK"}, 200



    from app.blueprints import bp as bp
    app.register_blueprint(bp)

    return app