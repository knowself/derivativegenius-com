from django.urls import path
from . import views

app_name = 'firebase'

urlpatterns = [
    # Authentication endpoints
    path('auth/signin/', views.signin, name='signin'),
    path('auth/session/', views.get_session, name='get_session'),
    path('auth/signout/', views.signout, name='signout'),
    
    # Admin endpoints
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/set-admin-status/', views.set_admin_status, name='set_admin_status'),
    path('admin/list-users/', views.list_users, name='list_users'),
    
    # Test endpoints
    path('test/', views.test_firebase, name='test_firebase'),
    path('test-config/', views.test_firebase_config, name='test_firebase_config'),
    path('test-env/', views.test_environment_variables, name='test_environment_variables'),
    path('firebase-test/', views.firebase_test, name='firebase-test'),
    path('config-test/', views.test_firebase_config, name='test-firebase-config'),
    path('auth-test/', views.test_firebase_auth, name='test-firebase-auth'),
    
    # Legacy endpoints
    path('auth/', views.auth_page, name='auth'),
    path('auth/verify/', views.verify_token, name='verify_token'),
]
