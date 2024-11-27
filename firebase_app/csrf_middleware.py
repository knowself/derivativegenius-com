from django.middleware.csrf import get_token
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class DebugCsrfMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log CSRF related information
        logger.debug(f"Request path: {request.path}")
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"CSRF Cookie: {request.COOKIES.get('csrftoken')}")
        logger.debug(f"CSRF Header: {request.headers.get('X-CSRFToken')}")
        
        # Ensure CSRF token is set in cookie for all requests
        if settings.DEBUG:
            get_token(request)
        
        response = self.get_response(request)
        
        # Log response CSRF related information
        logger.debug(f"Response status: {response.status_code}")
        logger.debug(f"Response cookies: {[k for k in response.cookies.keys()]}")
        
        # In development, ensure CSRF cookie is accessible
        if settings.DEBUG:
            if 'csrftoken' in response.cookies:
                response.cookies['csrftoken']['samesite'] = 'Lax'
                response.cookies['csrftoken']['secure'] = False
        
        return response
