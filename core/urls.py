# example/urls.py
from django.urls import path, include

from core.views import index, articles, contact, about, api_test, toggle_theme, health_check


urlpatterns = [
    path('', index, name='home'),
    path('articles/', articles, name='articles'),
    path('contact/', contact, name='contact'),
    path('about/', about, name='about'),
    path('api/test', api_test, name='api_test'),
    path('api/toggle-theme/', toggle_theme, name='toggle_theme'),
    path('health/', health_check, name='health_check'),
    path('firebase/', include('firebase_app.urls', namespace='firebase')),
]