# core/views.py
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
import os

def get_user_theme(request):
    if 'VERCEL' in os.environ:
        return request.COOKIES.get('theme', 'light')
    else:
        from .models import UserPreference
        if request.user.is_authenticated:
            pref, _ = UserPreference.objects.get_or_create(user=request.user)
        else:
            if not request.session.session_key:
                request.session.create()
            pref, _ = UserPreference.objects.get_or_create(session_key=request.session.session_key)
        return pref.theme

@ensure_csrf_cookie
def index(request):
    theme = get_user_theme(request)
    return render(request, 'core/pages/home.html', {'theme': theme})

def articles(request):
    theme = get_user_theme(request)
    return render(request, 'core/pages/articles.html', {'theme': theme})

def contact(request):
    theme = get_user_theme(request)
    if request.method == 'POST':
        # TODO: Add email sending functionality
        return JsonResponse({'status': 'success'})
    return render(request, 'core/pages/contact.html', {'theme': theme})

def about(request):
    theme = get_user_theme(request)
    return render(request, 'core/pages/about.html', {'theme': theme})

def api_test(request):
    return JsonResponse({
        'message': 'This is a serverless function running locally!',
        'timestamp': datetime.now().isoformat(),
        'query_params': dict(request.GET)
    })

@require_http_methods(['POST'])
def toggle_theme(request):
    current_theme = get_user_theme(request)
    new_theme = 'dark' if current_theme == 'light' else 'light'
    
    response = JsonResponse({'theme': new_theme})
    
    if 'VERCEL' in os.environ:
        response.set_cookie('theme', new_theme, max_age=31536000)  # 1 year
    else:
        from .models import UserPreference
        if request.user.is_authenticated:
            pref, _ = UserPreference.objects.get_or_create(user=request.user)
        else:
            if not request.session.session_key:
                request.session.create()
            pref, _ = UserPreference.objects.get_or_create(session_key=request.session.session_key)
        pref.theme = new_theme
        pref.save()
    
    return response