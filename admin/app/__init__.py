import os

import wtforms_json
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt import JWT
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException

from .auth import authenticate_function, identity_function

jwt = JWT()
db = SQLAlchemy()
cors = None


def create_app(environment='development'):
    global cors
    from config import config
    from .views import views
    app = Flask(__name__)
    wtforms_json.init()
    env = os.environ.get('FLASK_ENV', environment)
    active_config = config[env]
    app.config.from_object(active_config)
    db.init_app(app)

    cors = CORS(app, origins=active_config.CORS_ORIGINS)

    if active_config.JWT_ENABLED:
        jwt.authentication_handler(authenticate_function(active_config.JWT_USERS))
        jwt.identity_handler(identity_function(active_config.JWT_USERS))
        jwt.init_app(app)

    for prefix, blueprint in views.items():
        app.register_blueprint(blueprint, url_prefix=prefix)

    @app.errorhandler(HTTPException)
    def handle_http_error(exc):
        return jsonify({'status': 'E_HTTP_%d' % exc.code, 'message': exc.description}), exc.code

    return app
