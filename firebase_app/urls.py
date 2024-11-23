from django.urls import path
from . import views

app_name = 'firebase'

urlpatterns = [
    path('test/', views.test_firebase, name='test_firebase'),
    path('auth/', views.auth_page, name='auth'),
    path('auth/verify/', views.verify_token, name='verify_token'),
    path('test-config/', views.test_firebase_config, name='test_firebase_config'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/set-admin-status/', views.set_admin_status, name='set_admin_status'),
    path('admin/list-users/', views.list_users, name='list_users'),
]
