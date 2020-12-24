from functools import wraps

from flask import current_app
from werkzeug.security import safe_str_cmp


class AuthUser(object):
    def __init__(self, username, password):
        self.id = username
        self.username = username
        self.password = password

    def __str__(self):
        return "AuthUser(%s)" % self.id


def get_user_table(users):
    return {u.username: u for u in users}


def authenticate_function(table):
    def authenticate(username, password):
        user = table.get(username, None)
        if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
            return user

    return authenticate


def identity_function(table):
    def identity(payload):
        user_id = payload['identity']
        return table.get(user_id, None)

    return identity


def jwt_required(realm=None):
    """View decorator that requires a valid JWT token to be present in the request

    :param realm: an optional realm
    """
    from flask_jwt import _jwt_required

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if current_app.config['JWT_ENABLED']:
                _jwt_required(realm or current_app.config['JWT_DEFAULT_REALM'])
            return fn(*args, **kwargs)

        return decorator

    return wrapper
