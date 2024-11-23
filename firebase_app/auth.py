from django.contrib.auth.backends import BaseBackend, ModelBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from firebase_admin import auth
from .firebase_admin import get_auth
from .middleware import FirebaseAnonymousUser

def set_user_admin(uid, admin=True):
    """
    Set or remove admin claims for a Firebase user
    
    Args:
        uid (str): Firebase user ID
        admin (bool): Whether to set or remove admin claims
    """
    try:
        # Get current custom claims
        user = auth.get_user(uid)
        claims = user.custom_claims or {}
        
        # Update admin claim
        claims['admin'] = admin
        
        # Set custom claims
        auth.set_custom_user_claims(uid, claims)
        
        # Update Django user if exists
        UserModel = get_user_model()
        try:
            django_user = UserModel.objects.get(username=uid)
            django_user.is_staff = admin
            django_user.is_superuser = admin
            django_user.save()
        except UserModel.DoesNotExist:
            pass
            
        return True
    except Exception as e:
        print(f"Error setting admin claims: {str(e)}")
        return False

class FirebaseAuthenticationBackend(ModelBackend):
    def authenticate(self, request, id_token=None, username=None, password=None, **kwargs):
        # Handle Django admin login
        if username is not None and password is not None:
            return super().authenticate(request, username=username, password=password, **kwargs)
            
        # Handle Firebase authentication
        if not id_token:
            return FirebaseAnonymousUser()
            
        try:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Handle anonymous Firebase users
            if decoded_token.get('provider_id') == 'anonymous':
                anonymous_user = FirebaseAnonymousUser()
                anonymous_user.firebase_token = id_token
                anonymous_user.firebase_user = decoded_token
                return anonymous_user
            
            # Get or create Django user for authenticated users
            UserModel = get_user_model()
            try:
                user = UserModel.objects.get(username=uid)
                # Update admin status if needed
                if decoded_token.get('admin', False) and not user.is_staff:
                    user.is_staff = True
                    user.is_superuser = True
                    user.save()
            except UserModel.DoesNotExist:
                # Get the Firebase user data
                firebase_user = auth.get_user(uid)
                
                # Create a new Django user
                user = UserModel.objects.create(
                    username=uid,
                    email=firebase_user.email if firebase_user.email else f"{uid}@anonymous.com",
                    is_active=True
                )
                
                # Set admin status based on Firebase custom claims
                if decoded_token.get('admin', False):
                    user.is_staff = True
                    user.is_superuser = True
                    user.save()
            
            return user
        except Exception as e:
            print(f"Firebase authentication error: {str(e)}")
            return FirebaseAnonymousUser()

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return FirebaseAnonymousUser()
