from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from .firebase_admin import get_firestore, get_auth
from firebase_admin import firestore, auth
import json
import os
from functools import wraps
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

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

@api_view(['GET'])
def firebase_test(request):
    """Test Firebase connection by attempting to list users"""
    try:
        # Try to list one user (limit=1) to test connection
        auth.list_users(max_results=1)
        return Response({'status': 'Firebase connection successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Firebase connection failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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

@require_http_methods(["GET"])
def test_environment_variables(request):
    """Test endpoint to verify environment variables"""
    from django.conf import settings
    import os
    
    # Get variables from settings
    settings_vars = {
        'FIREBASE_ADMIN_PROJECT_ID': settings.FIREBASE_ADMIN_PROJECT_ID,
        'FIREBASE_ADMIN_CLIENT_EMAIL': settings.FIREBASE_ADMIN_CLIENT_EMAIL,
        'FIREBASE_WEB_API_KEY': settings.FIREBASE_WEB_API_KEY,
        'FIREBASE_ADMIN_PRIVATE_KEY': bool(settings.FIREBASE_ADMIN_PRIVATE_KEY),  # Only send existence
    }
    
    # Get variables directly from environment
    env_vars = {
        'FIREBASE_ADMIN_PROJECT_ID': os.getenv('FIREBASE_ADMIN_PROJECT_ID'),
        'FIREBASE_ADMIN_CLIENT_EMAIL': os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL'),
        'FIREBASE_WEB_API_KEY': os.getenv('FIREBASE_WEB_API_KEY'),
        'FIREBASE_ADMIN_PRIVATE_KEY': bool(os.getenv('FIREBASE_ADMIN_PRIVATE_KEY')),  # Only send existence
    }
    
    return JsonResponse({
        'debug_mode': settings.DEBUG,
        'settings_vars': settings_vars,
        'env_vars': env_vars,
        'env_file_loaded': os.path.exists(os.path.join(settings.BASE_DIR, '.env'))
    })

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

@require_http_methods(["GET"])
def get_session(request):
    """Get current user session information"""
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'user': None}, status=200)
            
        id_token = auth_header.split('Bearer ')[1]
        
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Get user info
        user = auth.get_user(uid)
        custom_claims = user.custom_claims or {}
        
        return JsonResponse({
            'user': {
                'uid': uid,
                'email': user.email,
                'emailVerified': user.email_verified,
                'displayName': user.display_name,
                'isAdmin': custom_claims.get('admin', False)
            }
        })
    except auth.InvalidIdTokenError:
        return JsonResponse({'user': None}, status=200)
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@ensure_csrf_cookie
@require_http_methods(["POST"])
def signin(request):
    """Handle user sign in verification using Firebase Admin SDK.
    
    Expects a POST request with:
    {
        "idToken": "Firebase ID token obtained from client-side authentication"
    }
    
    Returns:
    {
        "success": true,
        "user": {
            "uid": "user id",
            "email": "user email",
            "displayName": "user display name",
            "photoURL": "user photo url",
            "emailVerified": boolean,
            "isAdmin": boolean
        }
    }
    
    Errors:
    - 400: Missing or invalid request format
    - 401: Invalid token or user not found
    - 403: CSRF verification failed
    - 500: Internal server error
    - 503: Firebase Admin SDK unavailable
    """
    try:
        # Log request details
        print("=== Signin Request ===")
        print("Headers:", dict(request.headers))
        print("Content-Type:", request.headers.get('content-type'))
        print("Body:", request.body.decode('utf-8'))
        print("CSRF Token:", request.headers.get('X-CSRFToken'))
        print("Cookie CSRF Token:", request.COOKIES.get('csrftoken'))
        print("Method:", request.method)
        print("Is AJAX:", request.headers.get('X-Requested-With') == 'XMLHttpRequest')

        # Check if this is an AJAX request
        if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
            print("Error: Not an AJAX request")
            return JsonResponse({
                'error': 'CSRF verification failed. Request must include X-Requested-With header.'
            }, status=403)

        # Check CSRF token
        csrf_token = request.headers.get('X-CSRFToken')
        cookie_token = request.COOKIES.get('csrftoken')
        
        if not csrf_token or not cookie_token or csrf_token != cookie_token:
            print("Error: CSRF token mismatch")
            print(f"Header token: {csrf_token}")
            print(f"Cookie token: {cookie_token}")
            return JsonResponse({
                'error': 'CSRF token missing or invalid',
                'debug': {
                    'header_token': csrf_token,
                    'cookie_token': cookie_token
                }
            }, status=403)
        
        # Parse request body
        try:
            data = json.loads(request.body)
            id_token = data.get('idToken')
            print("Request data parsed successfully")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            print(f"Raw body: {request.body.decode('utf-8')}")
            return JsonResponse({
                'error': 'Invalid request format',
                'details': str(e)
            }, status=400)

        if not id_token:
            print("Missing ID token")
            return JsonResponse({
                'error': 'ID token is required'
            }, status=400)

        # Initialize Firebase Admin SDK
        try:
            auth_client = get_auth()
            print("Firebase Admin SDK initialized successfully")
        except Exception as e:
            print(f"Failed to initialize Firebase Admin SDK: {str(e)}")
            return JsonResponse({
                'error': 'Authentication service unavailable',
                'details': str(e)
            }, status=503)

        try:
            # Verify the ID token
            decoded_token = auth_client.verify_id_token(id_token)
            uid = decoded_token['uid']
            print(f"Token verified successfully for UID: {uid}")

            # Get user info
            user = auth_client.get_user(uid)
            print("User info retrieved successfully")

            # Get custom claims
            custom_claims = user.custom_claims or {}
            is_admin = custom_claims.get('admin', False)
            
            # Prepare response with user data
            response_data = {
                'success': True,
                'user': {
                    'uid': user.uid,
                    'email': user.email,
                    'displayName': user.display_name,
                    'photoURL': user.photo_url,
                    'emailVerified': user.email_verified,
                    'isAdmin': is_admin,
                }
            }
            
            print("Authentication successful")
            return JsonResponse(response_data)

        except auth.InvalidIdTokenError as e:
            print(f"Invalid token: {str(e)}")
            return JsonResponse({
                'error': 'Invalid or expired token'
            }, status=401)
        except auth.UserNotFoundError as e:
            print(f"User not found: {str(e)}")
            return JsonResponse({
                'error': 'User not found'
            }, status=401)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return JsonResponse({
                'error': 'Authentication failed',
                'details': str(e)
            }, status=401)

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JsonResponse({
            'error': 'Internal server error',
            'details': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def signout(request):
    """Sign out the current user"""
    try:
        # Clear any server-side session data
        request.session.flush()
        
        return JsonResponse({
            'success': True,
            'message': 'Successfully signed out'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
