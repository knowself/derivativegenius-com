from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('collections/', views.manage_collections, name='manage_collections'),
    path('users/', views.manage_users, name='manage_users'),
    path('settings/', views.firebase_settings, name='firebase_settings'),
]
