import datetime
import os

from app.auth import AuthUser, get_user_table

base_dir = os.path.dirname(os.path.abspath(__file__))


class BaseConfig(object):
    """Base configuration."""

    APP_NAME = 'Flask App'
    DEBUG_TB_ENABLED = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'Ensure you set a secret key, this is important!')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    JWT_ENABLED = False
    JWT_EXPIRATION_DELTA = datetime.timedelta(seconds=int(os.environ.get('JWT_EXPIRATION_DELTA', 3600)))
    CORS_ORIGINS = []
    BERT_SERVER = 'localhost'
    BERT_BATCH_SIZE = 16
    ES_SERVERS = ['localhost']
    ES_INDEX_NAME = 'qa-questions'


class DevelopmentConfig(BaseConfig):
    """Development configuration."""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DEVEL_DATABASE_URL', 'sqlite:///' + os.path.join(base_dir, 'database-devel.sqlite3'))


class TestingConfig(BaseConfig):
    """Testing configuration."""

    TESTING = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'TEST_DATABASE_URL', 'sqlite:///' + os.path.join(base_dir, 'database-test.sqlite3'))


class ProductionConfig(BaseConfig):
    """Production configuration."""

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 'sqlite:///' + os.path.join(base_dir, 'database.sqlite3'))
    JWT_ENABLED = True
    JWT_USERS = get_user_table([
        AuthUser('admin', 'hello'),
        AuthUser('user', 'world'),
    ])
    CORS_ORIGINS = ['http://admin.cngi.mta.nwafu.edu.cn']
    BERT_SERVER = '192.168.34.5'
    ES_SERVERS = ['192.168.34.4']


config = dict(
    development=DevelopmentConfig,
    testing=TestingConfig,
    production=ProductionConfig)
