# example/urls.py
from django.urls import path

from core.views import index, articles, contact, about, api_test, toggle_theme


urlpatterns = [
    path('', index, name='home'),
    path('articles/', articles, name='articles'),
    path('contact/', contact, name='contact'),
    path('about/', about, name='about'),
    path('api/test', api_test, name='api_test'),
    path('api/toggle-theme/', toggle_theme, name='toggle_theme'),
]