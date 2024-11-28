import os
from api.wsgi import application
from django.core.handlers.wsgi import WSGIRequest
from urllib.parse import parse_qs

# Set default environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

def handler(request):
    """Handle incoming requests and convert to WSGI format."""
    # Convert Vercel request to WSGI request format
    environ = {
        'REQUEST_METHOD': request.get('method', 'GET'),
        'SCRIPT_NAME': '',
        'PATH_INFO': request.get('path', '/'),
        'QUERY_STRING': request.get('query', ''),
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': None,
        'wsgi.errors': None,
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }

    # Add headers
    for key, value in request.get('headers', {}).items():
        key = key.upper().replace('-', '_')
        if key not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            key = f'HTTP_{key}'
        environ[key] = value

    # Create WSGI request
    wsgi_request = WSGIRequest(environ)
    
    # Handle CORS preflight requests
    if request.get('method') == 'OPTIONS':
        response = {
            'statusCode': 204,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
            }
        }
        return response

    # Process the request through Django application
    response = application(wsgi_request)
    
    return {
        'statusCode': response.status_code,
        'headers': dict(response.headers),
        'body': response.content.decode('utf-8')
    }
