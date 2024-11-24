"""
WSGI config for api project.

It exposes the WSGI callable as a module-level variable named ``app``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

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
