@ECHO OFF
ECHO Starting Flask Application

CALL venv\Scripts\activate
SET FLASK_APP=app

flask run