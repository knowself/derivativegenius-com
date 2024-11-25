"""
WSGI config for api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
import logging

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

# Configure logging
logging.basicConfig(
    level=logging.INFO if os.getenv('DEBUG_ENABLED', 'false').lower() == 'true' else logging.WARNING,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

application = get_wsgi_application()
app = application  # Add alias for Vercel
