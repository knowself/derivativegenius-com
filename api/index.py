import os
from api.wsgi import application

# Set default environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

# This is the handler that Vercel will use
def handler(request, **kwargs):
    return application(request, **kwargs)
