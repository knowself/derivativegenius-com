from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .firebase_admin import get_firestore, get_auth
from firebase_admin import firestore, auth
import json
import os
from functools import wraps

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
    """Verify Firebase ID token"""
    try:
        data = json.loads(request.body)
        token = data.get('token')
        if not token:
            return JsonResponse({'error': 'No token provided'}, status=400)

        # Verify the token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Get user info
        user = auth.get_user(uid)
        
        # Store or update user info in session
        request.session['user_id'] = uid
        request.session['user_email'] = user.email
        
        return JsonResponse({
            'status': 'success',
            'user': {
                'uid': uid,
                'email': user.email
            }
        })
    except auth.InvalidIdTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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
