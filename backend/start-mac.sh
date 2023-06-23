ECHO Starting Flask Application

source "./venv/bin/activate"


export FLASK_APP=app
export FLASK_ENV=production    # <-- production mode (???)
export FLASK_DEBUG=True        # <-- debug is ESSENTIAL in order for logging to work


flask run --port 5001