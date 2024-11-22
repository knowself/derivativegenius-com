from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from firebase_app.firebase_admin import get_firestore, get_auth
from functools import wraps
import json

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

@admin_required
def admin_dashboard(request):
    db = get_firestore()
    
    # Get collection statistics
    collections = db.collections()
    collection_stats = []
    
    for collection in collections:
        docs = collection.get()
        doc_count = sum(1 for _ in docs)
        collection_stats.append({
            'name': collection.id,
            'document_count': doc_count
        })
    
    # Get user statistics
    auth = get_auth()
    try:
        # List users is paginated, get first page
        users = auth.list_users()
        user_count = sum(1 for _ in users.iterate_all())
    except Exception as e:
        user_count = 0
    
    context = {
        'collection_stats': collection_stats,
        'user_count': user_count,
    }
    
    return render(request, 'admin_panel/dashboard.html', context)

@admin_required
def manage_collections(request):
    db = get_firestore()
    collections = db.collections()
    
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get('action')
        
        if action == 'create_collection':
            collection_name = data.get('collection_name')
            # Create a dummy document to initialize the collection
            db.collection(collection_name).document('_config').set({
                'created_at': firestore.SERVER_TIMESTAMP,
                'schema': data.get('schema', {})
            })
            return JsonResponse({'status': 'success'})
            
        elif action == 'delete_collection':
            collection_name = data.get('collection_name')
            # Delete all documents in collection
            docs = db.collection(collection_name).get()
            for doc in docs:
                doc.reference.delete()
            return JsonResponse({'status': 'success'})
    
    collections_data = []
    for collection in collections:
        docs = collection.get()
        collections_data.append({
            'name': collection.id,
            'document_count': sum(1 for _ in docs)
        })
    
    return render(request, 'admin_panel/collections.html', {'collections': collections_data})

@admin_required
def manage_users(request):
    auth = get_auth()
    
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get('action')
        
        if action == 'disable_user':
            uid = data.get('uid')
            auth.update_user(uid, disabled=True)
            return JsonResponse({'status': 'success'})
            
        elif action == 'enable_user':
            uid = data.get('uid')
            auth.update_user(uid, disabled=False)
            return JsonResponse({'status': 'success'})
            
        elif action == 'delete_user':
            uid = data.get('uid')
            auth.delete_user(uid)
            return JsonResponse({'status': 'success'})
    
    # Get list of users
    users = []
    for user in auth.list_users().iterate_all():
        users.append({
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name,
            'disabled': user.disabled,
            'created_at': user.user_metadata.creation_timestamp
        })
    
    return render(request, 'admin_panel/users.html', {'users': users})

@admin_required
def firebase_settings(request):
    db = get_firestore()
    
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get('action')
        
        if action == 'update_security_rules':
            # Note: This is a placeholder. Actual implementation would depend on
            # Firebase Admin SDK capabilities and your security requirements
            return JsonResponse({'status': 'success'})
            
        elif action == 'update_indexes':
            # Note: This is a placeholder. Actual implementation would depend on
            # your indexing requirements
            return JsonResponse({'status': 'success'})
    
    return render(request, 'admin_panel/settings.html')
