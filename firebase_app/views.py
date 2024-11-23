from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .firebase_admin import get_firestore, get_auth
from firebase_admin import firestore, auth
import json
import os
from functools import wraps
from django.contrib.auth import authenticate, login

# Create your views here.

def firebase_test_page(request):
    """Render Firebase test page with configuration"""
    firebase_config = {
        'api_key': os.getenv('FIREBASE_API_KEY'),
        'auth_domain': os.getenv('FIREBASE_AUTH_DOMAIN'),
        'project_id': os.getenv('FIREBASE_PROJECT_ID'),
        'storage_bucket': os.getenv('FIREBASE_STORAGE_BUCKET'),
        'messaging_sender_id': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
        'app_id': os.getenv('FIREBASE_APP_ID'),
    }
    return render(request, 'firebase_app/test.html', {'firebase_config': firebase_config})

def auth_page(request):
    """Render authentication page"""
    firebase_config = {
        'api_key': os.getenv('FIREBASE_API_KEY'),
        'auth_domain': os.getenv('FIREBASE_AUTH_DOMAIN'),
        'project_id': os.getenv('FIREBASE_PROJECT_ID'),
        'storage_bucket': os.getenv('FIREBASE_STORAGE_BUCKET'),
        'messaging_sender_id': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
        'app_id': os.getenv('FIREBASE_APP_ID'),
    }
    return render(request, 'firebase_app/auth.html', {'firebase_config': firebase_config})

@csrf_exempt
@require_http_methods(["POST"])
def verify_token(request):
    """Verify Firebase ID token and handle admin access"""
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No token provided'}, status=400)
            
        id_token = auth_header.split('Bearer ')[1]
        
        # Get next URL from request body
        data = json.loads(request.body)
        next_url = data.get('next', '/')

        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Get user info
        user = auth.get_user(uid)
        
        # Check if user is admin
        custom_claims = user.custom_claims or {}
        is_admin = custom_claims.get('admin', False)
        
        # Authenticate user in Django
        django_user = authenticate(request, id_token=id_token)
        if django_user and django_user.is_authenticated:
            login(request, django_user)
        
        # If trying to access admin and not an admin, redirect to home
        if next_url.startswith('/admin/') and not is_admin:
            return JsonResponse({
                'success': False,
                'error': 'Unauthorized access to admin area',
                'redirect_url': '/'
            }, status=403)
        
        return JsonResponse({
            'success': True,
            'redirect_url': next_url,
            'user': {
                'uid': uid,
                'email': user.email,
                'is_admin': is_admin
            }
        })
        
    except auth.InvalidIdTokenError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid token'
        }, status=401)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def test_firebase(request):
    """Test Firebase Admin SDK functionality"""
    results = {
        'status': 'success',
        'message': 'Firebase Admin SDK tests completed',
        'tests': {}
    }
    
    try:
        # Test Authentication
        firebase_auth = get_auth()
        try:
            # Create a test user if it doesn't exist
            test_email = 'test@example.com'
            test_password = 'testpassword123'
            
            try:
                # Try to get the user first
                user = firebase_auth.get_user_by_email(test_email)
                results['tests']['authentication'] = {
                    'status': 'success',
                    'message': 'Successfully accessed Authentication and found test user',
                    'data': {
                        'uid': user.uid,
                        'email': user.email
                    }
                }
            except auth.UserNotFoundError:
                # User doesn't exist, create one
                user = firebase_auth.create_user(
                    email=test_email,
                    password=test_password,
                    email_verified=False
                )
                results['tests']['authentication'] = {
                    'status': 'success',
                    'message': 'Successfully created test user',
                    'data': {
                        'uid': user.uid,
                        'email': user.email
                    },
                    'note': 'A test user has been created. You can now enable Email/Password authentication in the Firebase Console.'
                }
            
        except Exception as e:
            results['tests']['authentication'] = {
                'status': 'error',
                'message': str(e),
                'note': 'To fix this, go to Firebase Console > Authentication > Sign-in method and enable Email/Password authentication'
            }

        # Test Firestore
        try:
            db = get_firestore()
            test_ref = db.collection('test').document('test_doc')
            test_ref.set({
                'message': 'Hello from Firebase!',
                'timestamp': firestore.SERVER_TIMESTAMP
            })
            doc = test_ref.get()
            data = doc.to_dict()
            results['tests']['firestore'] = {
                'status': 'success',
                'message': 'Successfully wrote and read from Firestore',
                'data': data
            }
        except Exception as e:
            results['tests']['firestore'] = {
                'status': 'error',
                'message': str(e),
                'note': 'If Firestore API is not enabled, visit Firebase Console > Build > Firestore Database to set it up'
            }

        # If all tests failed, update overall status
        if all(test['status'] == 'error' for test in results['tests'].values()):
            results['status'] = 'error'
            results['message'] = 'All Firebase tests failed'
        # If some tests failed, mark as partial success
        elif any(test['status'] == 'error' for test in results['tests'].values()):
            results['status'] = 'partial'
            results['message'] = 'Some Firebase tests failed'

        return JsonResponse(results)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'tests': {}
        }, status=500)

@require_http_methods(["GET"])
def test_firebase_config(request):
    """Test Firebase configuration"""
    config = {
        'api_key': os.getenv('FIREBASE_API_KEY'),
        'auth_domain': os.getenv('FIREBASE_AUTH_DOMAIN'),
        'project_id': os.getenv('FIREBASE_PROJECT_ID'),
        'storage_bucket': os.getenv('FIREBASE_STORAGE_BUCKET'),
        'messaging_sender_id': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
        'app_id': os.getenv('FIREBASE_APP_ID'),
    }
    
    # Check for missing or empty configurations
    missing_configs = [key for key, value in config.items() if not value]
    
    if missing_configs:
        return JsonResponse({
            'status': 'error',
            'message': 'Missing Firebase configurations',
            'missing_fields': missing_configs
        }, status=400)
    
    # Test Firebase Admin SDK initialization
    try:
        firebase_auth = get_auth()
        
        # Test creating a test user to verify Email/Password auth is enabled
        try:
            test_email = 'test@example.com'
            test_password = 'testpassword123'
            
            try:
                # Try to get the user first
                user = firebase_auth.get_user_by_email(test_email)
                auth_status = "Email/Password authentication is enabled and working"
            except auth.UserNotFoundError:
                # User doesn't exist, try to create one
                user = firebase_auth.create_user(
                    email=test_email,
                    password=test_password,
                    email_verified=False
                )
                auth_status = "Successfully created test user. Email/Password authentication is working"
        except Exception as auth_error:
            auth_status = f"Warning: Email/Password authentication might not be enabled: {str(auth_error)}"
        
        return JsonResponse({
            'status': 'success',
            'message': 'Firebase configuration is valid',
            'auth_status': auth_status,
            'config': {
                **config,
                'api_key': '***' if config['api_key'] else None  # Hide API key
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def admin_required(view_func):
    """Decorator to require admin authentication"""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            # Check if user is logged in
            if 'user_id' not in request.session:
                return redirect('firebase:auth')

            # Get Firebase user
            firebase_auth = get_auth()
            user = firebase_auth.get_user(request.session['user_id'])

            # Check custom claims
            if not user.custom_claims or not user.custom_claims.get('admin'):
                return redirect('firebase:auth')

            return view_func(request, *args, **kwargs)
        except Exception as e:
            print(f"Admin access error: {str(e)}")
            return redirect('firebase:auth')
    return _wrapped_view

@admin_required
def admin_dashboard(request):
    """Render Firebase admin dashboard"""
    firebase_config = {
        'api_key': os.getenv('FIREBASE_API_KEY'),
        'auth_domain': os.getenv('FIREBASE_AUTH_DOMAIN'),
        'project_id': os.getenv('FIREBASE_PROJECT_ID'),
        'storage_bucket': os.getenv('FIREBASE_STORAGE_BUCKET'),
        'messaging_sender_id': os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
        'app_id': os.getenv('FIREBASE_APP_ID'),
    }
    return render(request, 'firebase_app/admin.html', {'firebase_config': firebase_config})

@csrf_exempt
@require_http_methods(["POST"])
def set_admin_status(request):
    """
    Set or remove admin status for a Firebase user.
    Requires the current user to be an admin.
    """
    try:
        # Get the authorization token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No authorization token provided'}, status=401)
        
        id_token = auth_header.split('Bearer ')[1]
        
        # Verify the current user is an admin
        current_user = auth.verify_id_token(id_token)
        if not current_user.get('admin', False):
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        # Get request data
        data = json.loads(request.body)
        target_uid = data.get('uid')
        admin_status = data.get('admin', True)
        
        if not target_uid:
            return JsonResponse({'error': 'User ID not provided'}, status=400)
        
        # Set admin status
        success = set_user_admin(target_uid, admin_status)
        
        if success:
            return JsonResponse({
                'message': f"Admin status {'set' if admin_status else 'removed'} successfully",
                'uid': target_uid,
                'admin': admin_status
            })
        else:
            return JsonResponse({'error': 'Failed to update admin status'}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def list_users(request):
    """List all Firebase users for admin dashboard"""
    try:
        # Get the authorization token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No authorization token provided'}, status=401)
            
        id_token = auth_header.split('Bearer ')[1]
        
        # Verify the current user is an admin
        current_user = auth.verify_id_token(id_token)
        if not current_user.get('admin', False):
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        # List all users
        users = []
        page = auth.list_users()
        for user in page.users:
            users.append({
                'uid': user.uid,
                'email': user.email,
                'displayName': user.display_name,
                'customClaims': user.custom_claims,
                'disabled': user.disabled,
                'emailVerified': user.email_verified,
                'creationTime': user.user_metadata.creation_timestamp,
                'lastSignInTime': user.user_metadata.last_sign_in_timestamp
            })
            
        return JsonResponse({
            'users': users
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
