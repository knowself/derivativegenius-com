from django.contrib.auth.models import AnonymousUser
from firebase_admin import auth
from django.utils.functional import SimpleLazyObject
from django.contrib.auth import get_user_model
from .firebase_admin import initialize_firebase_admin

User = get_user_model()

def get_user_from_firebase(request):
    """Get user from Firebase token"""
    authorization = request.headers.get('Authorization', '')
    
    if not authorization.startswith('Bearer '):
        return AnonymousUser()
    
    token = authorization.split('Bearer ')[1]
    
    try:
        # Verify the Firebase token
        decoded_token = auth.verify_id_token(token)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=decoded_token.get('email'),
            defaults={
                'username': decoded_token.get('email'),
                'first_name': decoded_token.get('name', '').split()[0] if decoded_token.get('name') else '',
                'last_name': decoded_token.get('name', '').split()[-1] if decoded_token.get('name') else '',
            }
        )
        
        return user
    except Exception as e:
        print(f"Firebase auth error: {str(e)}")
        return AnonymousUser()

class FirebaseAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Initialize Firebase Admin when middleware is loaded
        initialize_firebase_admin()

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: get_user_from_firebase(request))
        return self.get_response(request)
