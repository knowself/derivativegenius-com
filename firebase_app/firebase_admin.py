import os
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, auth

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK using either local file or environment variables."""
    try:
        # First try using individual environment variables (production)
        if all(key in os.environ for key in ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL']):
            cred_dict = {
                "type": "service_account",
                "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
                "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)
        else:
            # Fallback to local file for development
            base_dir = Path(__file__).resolve().parent.parent
            cred_path = base_dir / 'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json'
            if not cred_path.exists():
                raise FileNotFoundError(
                    "Firebase credentials not found. For production, set these environment variables:\n"
                    "- FIREBASE_PROJECT_ID\n"
                    "- FIREBASE_PRIVATE_KEY\n"
                    "- FIREBASE_CLIENT_EMAIL\n"
                    "For development, ensure the credentials file exists."
                )
            cred = credentials.Certificate(str(cred_path))
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
        raise
    
    return firebase_admin.get_app()

def get_firestore():
    """Get Firestore client"""
    initialize_firebase_admin()
    return firestore.client()

def get_auth():
    """Get Firebase Auth client"""
    return auth.Client(app=firebase_admin.get_app())
