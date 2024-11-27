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
        logger.debug(f"Origin: {request.headers.get('Origin')}")
        logger.debug(f"Referer: {request.headers.get('Referer')}")
        logger.debug(f"Host: {request.headers.get('Host')}")
        
        # Always ensure CSRF token is set in development
        if settings.DEBUG:
            token = get_token(request)
            logger.debug(f"Generated CSRF token: {token}")
        
        response = self.get_response(request)
        
        # Log response CSRF related information
        logger.debug(f"Response status: {response.status_code}")
        logger.debug(f"Response cookies: {[k for k in response.cookies.keys()]}")
        
        # In development, ensure CSRF cookie is accessible
        if settings.DEBUG and 'csrftoken' in response.cookies:
            logger.debug("Configuring CSRF cookie for development")
            
            # Get the origin domain
            origin = request.headers.get('Origin', '')
            if origin:
                try:
                    from urllib.parse import urlparse
                    domain = urlparse(origin).netloc.split(':')[0]
                    logger.debug(f"Setting cookie domain to: {domain}")
                except Exception as e:
                    logger.error(f"Error parsing origin: {e}")
                    domain = None
            else:
                domain = None
            
            response.cookies['csrftoken'].update({
                'samesite': 'Lax',
                'secure': False,
                'httponly': False,
                'domain': domain,
                'path': '/'
            })
            
            # Log final cookie configuration
            cookie = response.cookies['csrftoken']
            logger.debug(f"Final cookie config: samesite={cookie['samesite']}, secure={cookie['secure']}, httponly={cookie['httponly']}, domain={cookie['domain']}, path={cookie['path']}")
        
        return response
