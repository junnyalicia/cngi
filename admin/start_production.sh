#!/bin/bash

source .env
export DATABASE_URL
FLASK_ENV=production gunicorn -c gunicorn-conf.py "app:create_app()"

