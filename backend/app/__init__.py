import os

import sentry_sdk
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from sentry_sdk.integrations.flask import FlaskIntegration

from config import config
from .models import db

active_config = None
migrate = Migrate()
app = None
cors = None


def create_app(config_name=None):
    global active_config, app, cors
    if not config_name:
        config_name = os.environ.get('FLASK_ENV', 'default')
    active_config = config[config_name]
    # Configure Sentry SDK
    if active_config.SENTRY_ENABLED:
        sentry_sdk.init(dsn=active_config.SENTRY_DSN, integrations=[FlaskIntegration()])
    # Create Flask app
    app = Flask(__name__, template_folder=os.path.join(active_config.BASEDIR, 'app', 'templates'),
                static_folder=os.path.join(active_config.BASEDIR, 'app', 'static'))
    app.config.from_object(active_config)
    # Configure CORS headers
    cors = CORS(app, origins=active_config.CORS_ORIGINS)
    # Register database
    db.init_app(app)
    # Enable Migration
    migrate.init_app(app, db)
    # Register Blueprints
    from .views import blueprints
    for p, v in blueprints.items():
        app.register_blueprint(v, url_prefix=p)
    # Register commands
    from .commands import commands
    for x in commands:
        app.cli.add_command(x)
    return app
