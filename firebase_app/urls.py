from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_firebase, name='test_firebase'),
    path('auth/', views.auth_page, name='auth_page'),
    path('auth/verify/', views.verify_token, name='verify_token'),
]
