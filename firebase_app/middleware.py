from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject
from django.shortcuts import redirect
from django.urls import reverse
from firebase_admin import auth
from .firebase_admin import initialize_firebase_admin
import firebase_admin.auth

User = get_user_model()

class FirebaseAnonymousUser(AnonymousUser):
    """Custom Anonymous User that includes Firebase anonymous authentication"""
    
    def __init__(self):
        super().__init__()
        self.firebase_token = None
        self.firebase_user = None
    
    def get_or_create_firebase_token(self):
        if not self.firebase_token:
            try:
                # Create a custom token for anonymous users
                anonymous_custom_token = auth.create_custom_token('anonymous')
                self.firebase_token = anonymous_custom_token.decode('utf-8')
            except Exception as e:
                print(f"Error creating anonymous Firebase token: {str(e)}")
        return self.firebase_token

def get_user(request):
    if not hasattr(request, '_cached_user'):
        # Check if user is already authenticated in session
        if request.session.get('_auth_user_id'):
            request._cached_user = User.objects.get(pk=request.session['_auth_user_id'])
            return request._cached_user

        # Get the ID token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            id_token = auth_header.split('Bearer ')[1]
            try:
                # Verify the Firebase ID token
                decoded_token = auth.verify_id_token(id_token)
                # Authenticate user using our custom backend
                user = authenticate(request, id_token=id_token)
                if user and user.is_authenticated:
                    request._cached_user = user
                    # Ensure the user is logged in to Django's session
                    login(request, user)
                else:
                    anonymous_user = FirebaseAnonymousUser()
                    request._cached_user = anonymous_user
            except Exception as e:
                print(f"Firebase auth error: {str(e)}")
                anonymous_user = FirebaseAnonymousUser()
                request._cached_user = anonymous_user
        else:
            anonymous_user = FirebaseAnonymousUser()
            request._cached_user = anonymous_user
    return request._cached_user

class FirebaseAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Initialize Firebase Admin when middleware is loaded
        initialize_firebase_admin()

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: get_user(request))
        
        # Handle admin access
        if request.path.startswith('/admin/'):
            # Skip auth check for admin login page and its resources
            if request.path.startswith('/admin/login/') or \
               any(request.path.endswith(ext) for ext in ['.css', '.js', '.png', '.jpg', '.gif', '.ico']):
                return self.get_response(request)
                
            user = request.user
            if not user.is_authenticated or not user.is_staff:
                return redirect(f'/firebase/auth/?next={request.path}')
        
        return self.get_response(request)
