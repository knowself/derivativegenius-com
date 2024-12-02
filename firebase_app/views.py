from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.conf import settings
from .firebase_admin import get_firestore, get_auth
from firebase_admin import auth, credentials, firestore
import json
import traceback
import logging
from datetime import datetime
import os
from functools import wraps
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import firebase_admin

# Create your views here.

def firebase_test_page(request):
    """Render Firebase test page with configuration"""
    firebase_config = {
        'api_key': settings.FIREBASE_WEB_API_KEY,
        'project_id': settings.FIREBASE_ADMIN_PROJECT_ID,
        'auth_domain': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.firebaseapp.com",
        'storage_bucket': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.appspot.com",
        'messaging_sender_id': settings.FIREBASE_CONFIG.get('client_id', ''),
        'app_id': settings.FIREBASE_CONFIG.get('app_id', ''),
    }
    return render(request, 'firebase_app/test.html', {'firebase_config': firebase_config})

def auth_page(request):
    """Render authentication page"""
    firebase_config = {
        'api_key': settings.FIREBASE_WEB_API_KEY,
        'project_id': settings.FIREBASE_ADMIN_PROJECT_ID,
        'auth_domain': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.firebaseapp.com",
        'storage_bucket': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.appspot.com",
        'messaging_sender_id': settings.FIREBASE_CONFIG.get('client_id', ''),
        'app_id': settings.FIREBASE_CONFIG.get('app_id', ''),
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
    """Test endpoint to verify Firebase configuration"""
    from django.http import JsonResponse
    from django.conf import settings
    import os.path

    # Check if Firebase credentials file exists
    creds_path = settings.FIREBASE_CREDENTIALS_PATH
    if not os.path.exists(creds_path):
        return JsonResponse({
            'error': f'Firebase credentials file not found at {creds_path}'
        }, status=404)

    # Check if file is readable
    try:
        with open(creds_path) as f:
            import json
            creds = json.load(f)
            # Basic validation of JSON structure
            required_fields = ['type', 'project_id', 'private_key_id', 'private_key']
            missing_fields = [field for field in required_fields if field not in creds]
            if missing_fields:
                return JsonResponse({
                    'error': f'Firebase credentials file is missing required fields: {", ".join(missing_fields)}'
                }, status=400)
    except (IOError, json.JSONDecodeError) as e:
        return JsonResponse({
            'error': f'Error reading Firebase credentials file: {str(e)}'
        }, status=500)

    return JsonResponse({'status': 'Firebase configuration is valid'})

def test_firebase_auth(request):
    """Test endpoint to verify Firebase authentication"""
    from django.http import JsonResponse
    import firebase_admin
    from firebase_admin import auth

    try:
        # Try to get the Firebase app
        app = firebase_admin.get_app()
        # Create a test token to verify auth works
        custom_token = auth.create_custom_token('test-user')
        return JsonResponse({'status': 'Firebase authentication is working'})
    except Exception as e:
        return JsonResponse({
            'error': f'Firebase authentication test failed: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def test_environment_variables(request):
    """Test endpoint to verify Firebase configuration"""
    from django.conf import settings
    import os.path
    import json

    # Check Firebase credentials file
    creds_path = settings.FIREBASE_CREDENTIALS_PATH
    creds_status = {
        'file_exists': os.path.exists(creds_path),
        'file_readable': False,
        'is_valid_json': False,
        'has_required_fields': False,
        'required_fields_status': {}
    }

    if creds_status['file_exists']:
        try:
            with open(creds_path) as f:
                creds_status['file_readable'] = True
                try:
                    creds = json.load(f)
                    creds_status['is_valid_json'] = True
                    
                    # Check required fields
                    required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
                    creds_status['required_fields_status'] = {
                        field: field in creds for field in required_fields
                    }
                    creds_status['has_required_fields'] = all(creds_status['required_fields_status'].values())
                    
                    # Only include non-sensitive information
                    settings_vars = {
                        'project_id': creds.get('project_id', ''),
                        'client_email': creds.get('client_email', ''),
                        'type': creds.get('type', ''),
                        'has_private_key': bool(creds.get('private_key')),
                    }
                except json.JSONDecodeError:
                    settings_vars = {}
        except IOError:
            settings_vars = {}
    else:
        settings_vars = {}

    # Check web API key (still in .env)
    web_api_key_status = {
        'exists': bool(settings.FIREBASE_WEB_API_KEY),
        'value': '***' if settings.FIREBASE_WEB_API_KEY else None
    }
    
    return JsonResponse({
        'status': 'success' if creds_status['has_required_fields'] and web_api_key_status['exists'] else 'error',
        'credentials_file_status': creds_status,
        'web_api_key_status': web_api_key_status,
        'settings_vars': settings_vars,
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
        'api_key': settings.FIREBASE_WEB_API_KEY,
        'project_id': settings.FIREBASE_ADMIN_PROJECT_ID,
        'auth_domain': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.firebaseapp.com",
        'storage_bucket': f"{settings.FIREBASE_ADMIN_PROJECT_ID}.appspot.com",
        'messaging_sender_id': settings.FIREBASE_CONFIG.get('client_id', ''),
        'app_id': settings.FIREBASE_CONFIG.get('app_id', ''),
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

@csrf_exempt
@ensure_csrf_cookie
@require_http_methods(["POST", "OPTIONS"])
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
    # Handle OPTIONS request for CORS preflight
    if request.method == "OPTIONS":
        response = JsonResponse({})
        return response
        
    try:
        # Log request details
        print("\n=== Signin Request ===")
        print("Headers:", {k:v for k,v in dict(request.headers).items() if k.lower() not in ['authorization']})
        print("Content-Type:", request.headers.get('content-type'))
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
        
        if not csrf_token or not cookie_token:
            print("Error: Missing CSRF token")
            print(f"CSRF token in header: {'Yes' if csrf_token else 'No'}")
            print(f"CSRF token in cookie: {'Yes' if cookie_token else 'No'}")
            return JsonResponse({
                'error': 'Missing CSRF token'
            }, status=403)
            
        if csrf_token != cookie_token:
            print("\n=== CSRF Token Mismatch ===")
            print(f"Header token length: {len(csrf_token) if csrf_token else 0}")
            print(f"Cookie token length: {len(cookie_token) if cookie_token else 0}")
            return JsonResponse({
                'error': 'CSRF token mismatch'
            }, status=403)

        # Parse request body
        try:
            data = json.loads(request.body)
            id_token = data.get('idToken')
            print("\n=== Request Data ===")
            print("ID Token present:", bool(id_token))
        except json.JSONDecodeError as e:
            print("\n=== JSON Decode Error ===")
            print(f"Error: {str(e)}")
            return JsonResponse({
                'error': 'Invalid JSON in request body'
            }, status=400)

        if not id_token:
            print("Error: No ID token provided")
            return JsonResponse({
                'error': 'No ID token provided'
            }, status=400)

        try:
            # Get Firebase Admin instance
            firebase_auth = get_auth()
            if not firebase_auth:
                print("\n=== Firebase Admin Error ===")
                print("Error: Could not initialize Firebase Admin")
                return JsonResponse({
                    'error': 'Firebase Admin SDK unavailable'
                }, status=503)

            print("\n=== Firebase Admin Status ===")
            print("Firebase Auth:", firebase_auth)
            print("Firebase App:", firebase_admin.get_app())
            
            # Verify the ID token
            try:
                print("\n=== Token Verification ===")
                print(f"Token length: {len(id_token)}")
                print(f"Token prefix: {id_token[:50]}...")
                print(f"Token suffix: ...{id_token[-50:]}")
                
                try:
                    # First try normal verification
                    decoded_token = firebase_auth.verify_id_token(id_token)
                except auth.InvalidIdTokenError as e:
                    if "Token used too early" in str(e):
                        # If token is too early, wait 5 seconds and try again
                        print("\n=== Token Time Skew Detected ===")
                        print("Waiting 5 seconds and retrying...")
                        import time
                        time.sleep(5)
                        decoded_token = firebase_auth.verify_id_token(id_token)
                    else:
                        raise
                
                print("\n=== Token Verification Success ===")
                print("Decoded token:", {k:v for k,v in decoded_token.items() if k not in ['exp', 'iat']})
                
                # Get user info
                uid = decoded_token['uid']
                user = firebase_auth.get_user(uid)
                
                print("\n=== User Info ===")
                print(f"UID: {uid}")
                print(f"Email: {user.email}")
                print(f"Email verified: {user.email_verified}")
                print(f"Custom claims: {user.custom_claims}")
                
                response_data = {
                    'success': True,
                    'user': {
                        'uid': uid,
                        'email': user.email,
                        'emailVerified': user.email_verified,
                        'displayName': user.display_name,
                        'photoURL': user.photo_url,
                        'claims': {
                            'admin': user.custom_claims.get('admin', False) if user.custom_claims else False,
                            'staff': user.custom_claims.get('staff', False) if user.custom_claims else False
                        }
                    }
                }
                
                print("\n=== Authentication Success ===")
                print("Response data:", response_data)
                return JsonResponse(response_data)
                
            except auth.InvalidIdTokenError as e:
                print("\n=== Token Verification Failed ===")
                print(f"Error type: {type(e)}")
                print(f"Error message: {str(e)}")
                print(f"Error details: {getattr(e, 'detail', 'No details')}")
                return JsonResponse({
                    'error': 'Invalid token',
                    'message': str(e)
                }, status=401)
            except auth.UserNotFoundError:
                print("\n=== User Not Found ===")
                return JsonResponse({
                    'error': 'User not found'
                }, status=404)
            except Exception as e:
                print("\n=== Unexpected Error ===")
                print(f"Error type: {type(e)}")
                print(f"Error message: {str(e)}")
                print(f"Traceback: {traceback.format_exc()}")
                return JsonResponse({
                    'error': 'Server error',
                    'message': 'An unexpected error occurred'
                }, status=500)
            
        except Exception as e:
            print("\n=== Firebase Admin Error ===")
            print(f"Error: {str(e)}")
            return JsonResponse({
                'error': 'Internal server error',
                'message': str(e)
            }, status=500)
            
    except Exception as e:
        print("\n=== Unexpected Error ===")
        print(f"Error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return JsonResponse({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
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
