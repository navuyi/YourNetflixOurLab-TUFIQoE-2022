import sqlite3
from .utils.dict_factory import dict_factory
from flask import g, current_app
import os

APP_ROOT = os.path.dirname(os.path.realpath(__file__))
DATABASE = os.path.join(APP_ROOT, "..", "database")
DATABASE_PATH = os.path.join(DATABASE, "database.db")


def db_get():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE_PATH)
        g.db.row_factory = dict_factory
        g.db.isolation_level = None     # <-- Auto Commit
    return g.db


def cursor():
    if 'cursor' not in g:
        g.cursor = db_get().cursor()
    return g.cursor


def commit():
    db_get().commit()


def rollback():
    db_get().rollback()


def lastrowid():
    return cursor().lastrowid


def db_close(e=None):
    cur = g.pop('cursor', None)

    if cur is not None:
        cur.close()

    db = g.pop('db', None)

    if db is not None:
        db.close()


def db_init_app(app):
    app.teardown_appcontext(db_close)


def db_before_request():
    db_get()
    cursor()
    return None
