import os

def firebase_config(request):
    """Add Firebase configuration to all template contexts"""
    return {
        'firebase_config': {
            'api_key': os.getenv('FIREBASE_API_KEY'),
            'auth_domain': os.getenv('FIREBASE_AUTH_DOMAIN'),
            'project_id': os.getenv('FIREBASE_PROJECT_ID'),
            'storage_bucket': os.getenv('FIREBASE_STORAGE_BUCKET'),
            'messaging_sender_id': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
            'app_id': os.getenv('FIREBASE_APP_ID'),
        }
    }
