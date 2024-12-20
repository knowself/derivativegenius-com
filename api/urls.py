"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import gateway
from health_check.views import MainView

urlpatterns = [
    # Health check endpoints (no auth required)
    path('health/', gateway.health_check, name='health_check'),
    path('vue-status/', gateway.vue_status, name='vue_status'),
    
    # Health Check URLs
    path('ht/', include('health_check.urls')),
    
    # Admin and application endpoints
    path('admin/', admin.site.urls),
    path('firebase-admin/', include('admin_panel.urls')),  # Custom Firebase admin panel
    # Removed duplicate firebase URL pattern - now handled in core/urls.py
    path('', include('core.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
