import os
from django.conf import settings

def firebase_config(request):
    """Add Firebase configuration to template context."""
    return {
        'firebase_config': {
            'api_key': settings.FIREBASE_WEB_API_KEY,
            'project_id': settings.FIREBASE_ADMIN_PROJECT_ID,
            'auth_domain': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.firebaseapp.com",
            'storage_bucket': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.appspot.com",
            'messaging_sender_id': settings.FIREBASE_CONFIG.get('client_id', ''),
            'app_id': settings.FIREBASE_CONFIG.get('app_id', ''),
        }
    }
