@ECHO OFF
ECHO Starting Flask Application

CALL venv\Scripts\activate
SET FLASK_APP=app
SET FLASK_ENV=production    &:: <-- production mode (???)
SET FLASK_DEBUG=True        &:: <-- debug is ESSENTIAL in order for logging to work


python -m flask run --port 5001