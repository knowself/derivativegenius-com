from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
import logging

logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
@ensure_csrf_cookie
def health_check(request):
    logger.debug("Health check endpoint called")
    logger.debug(f"CSRF Cookie: {request.COOKIES.get('csrftoken')}")
    logger.debug(f"Request Headers: {dict(request.headers)}")
    return JsonResponse({"status": "healthy"})

@require_http_methods(["GET"])
def vue_status(request):
    """
    Endpoint for Vue to verify Django API is accessible
    """
    return JsonResponse({
        'status': 'ok',
        'server': 'django',
        'auth_required': True
    })
