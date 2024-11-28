from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
import firebase_admin
from firebase_admin import credentials
import os

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
            if not firebase_admin._apps:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                })
                firebase_admin.initialize_app(cred)
            
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
