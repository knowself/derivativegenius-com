# core/views.py
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import UserPreference

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

def get_user_theme(request):
    if request.user.is_authenticated:
        pref, _ = UserPreference.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        pref, _ = UserPreference.objects.get_or_create(session_key=request.session.session_key)
    return pref.theme

@require_http_methods(['POST'])
def toggle_theme(request):
    if request.user.is_authenticated:
        pref, _ = UserPreference.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        pref, _ = UserPreference.objects.get_or_create(session_key=request.session.session_key)
    
    pref.theme = 'dark' if pref.theme == 'light' else 'light'
    pref.save()
    
    return JsonResponse({'theme': pref.theme})