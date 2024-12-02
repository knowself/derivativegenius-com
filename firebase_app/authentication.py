from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
from django.conf import settings

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK."""
    try:
        # Check if already initialized
        try:
            app = auth.get_app()
            return app
        except ValueError:
            pass  # Not initialized yet

        # Initialize with credentials from settings
        cred = auth.Certificate(settings.FIREBASE_CONFIG)
        return auth.initialize_app(cred)

    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
        raise

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            # Allow unauthenticated access
            return None
        
        if not auth_header.startswith('Bearer '):
            raise exceptions.AuthenticationFailed('Invalid token format')
        
        token = auth_header.split(' ')[1]
        
        try:
            # Initialize Firebase Admin if not already initialized
            initialize_firebase_admin()
            
            # Verify the token
            decoded_token = auth.verify_id_token(token)
            
            # Get or create user
            try:
                user = User.objects.get(username=decoded_token['uid'])
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=decoded_token['uid'],
                    email=decoded_token.get('email', ''),
                )
            
            return (user, None)
            
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
    
    def authenticate_header(self, request):
        return 'Bearer'
