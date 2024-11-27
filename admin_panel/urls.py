from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('collections/', views.manage_collections, name='manage_collections'),
    path('users/', views.manage_users, name='manage_users'),
    path('settings/', views.firebase_settings, name='firebase_settings'),
    path('metrics/', views.system_health, name='system_health'),
    path('api/metrics/django', views.django_metrics, name='django_metrics'),
    path('api/metrics/firebase', views.firebase_metrics, name='firebase_metrics'),
    path('api/metrics/system', views.system_metrics, name='system_metrics'),
]
