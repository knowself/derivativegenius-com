"""
WSGI config for api project.

It exposes the WSGI callable as a module-level variable named ``app``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise
import logging
import sys
import json
from datetime import datetime
from flask import request, g
import traceback

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

# Get the Django WSGI application
application = get_wsgi_application()

# Wrap the application with WhiteNoise and configure MIME types
application = WhiteNoise(
    application,
    mimetypes={
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
    }
)

# Vercel requires the variable to be named 'app'
app = application

# Configure logging based on environment variable
DEBUG_ENABLED = os.getenv('DEBUG_ENABLED', 'false').lower() == 'true'

# Configure logging only if debug is enabled
if DEBUG_ENABLED:
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.INFO,
        format='[%(asctime)s] [%(levelname)s] [API] %(message)s'
    )
    logger = logging.getLogger(__name__)
else:
    # Null logger when debug is disabled
    logger = logging.getLogger('null')
    logger.addHandler(logging.NullHandler())

@app.before_request
def log_request():
    if not DEBUG_ENABLED:
        return
    logger.info(json.dumps({
        'event': 'request_started',
        'method': request.method,
        'path': request.path,
        'headers': dict(request.headers),
        'args': dict(request.args),
        'timestamp': datetime.utcnow().isoformat()
    }))
    if request.is_json:
        logger.info(json.dumps({
            'event': 'request_json',
            'body': request.get_json(),
            'timestamp': datetime.utcnow().isoformat()
        }))

@app.after_request
def log_response(response):
    if not DEBUG_ENABLED:
        return response
    logger.info(json.dumps({
        'event': 'request_completed',
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'size': len(response.get_data()),
        'duration': request.environ.get('REQUEST_TIME'),
        'timestamp': datetime.utcnow().isoformat()
    }))
    return response

@app.errorhandler(Exception)
def log_error(error):
    if not DEBUG_ENABLED:
        return {'error': str(error)}, 500
    logger.error(json.dumps({
        'event': 'request_error',
        'method': request.method,
        'path': request.path,
        'error': str(error),
        'traceback': traceback.format_exc(),
        'timestamp': datetime.utcnow().isoformat()
    }))
    return {'error': str(error)}, 500
