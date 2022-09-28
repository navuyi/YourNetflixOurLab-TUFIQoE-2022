import os
from flask import Flask
from flask_cors import CORS
import logging
import click
import re
import time
import string
import datetime


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
    #cors = CORS(app)

    # Import database methods
    from . db import db_init_app, db_before_request, cursor, db_get

    # Configure test path

    @app.route('/test', methods=["GET"])
    def test():
        return {"msg": "OK"}, 200

    ### Logging stuff ###
    class NoColorFormatter(logging.Formatter):
        """
        Log formatter that strips terminal colour
        escape codes from the log message.
        """
        # Regex for ANSI colour codes
        ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")
        DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f"

        def format(self, record):
            """Return logger message with terminal escapes removed."""
            msg_or_message = record.message if (record.msg and record.args) else record.msg

            return "%s | %s | %s" % (
                datetime.datetime.now().strftime(self.DATETIME_FORMAT),
                re.sub(self.ANSI_RE, "", record.levelname),
                re.sub(self.ANSI_RE, "", msg_or_message)
            )

    no_color_formatter = NoColorFormatter()

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)  # or whatever

    handler = logging.FileHandler('logs.log', 'a', 'utf-8')  # or whatever
    handler.setFormatter(no_color_formatter)  # or whatever

    root_logger.addHandler(handler)

    from app.blueprints import bp as bp
    app.register_blueprint(bp)

    return app
