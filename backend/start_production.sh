#!/bin/bash

FLASK_CONFIG=production gunicorn -c gunicorn-conf.py "app:create_app()"

