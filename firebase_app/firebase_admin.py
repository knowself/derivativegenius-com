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
            # Handle private key with proper newline conversion
            private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
            if private_key.startswith('"') and private_key.endswith('"'):
                private_key = private_key[1:-1]  # Remove surrounding quotes if present
            private_key = private_key.replace('\\n', '\n')  # Convert \n strings to actual newlines
            
            cred_dict = {
                "type": "service_account",
                "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
                "private_key": private_key,
                "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ.get('FIREBASE_CLIENT_EMAIL').replace('@', '%40')}"
            }
            
            # Log initialization attempt (without sensitive data)
            print(f"Initializing Firebase Admin SDK with project: {cred_dict['project_id']}")
            
            try:
                cred = credentials.Certificate(cred_dict)
            except ValueError as ve:
                print(f"Error creating credentials certificate: {ve}")
                print("Private key format:", private_key[:10] + "..." + private_key[-10:])
                raise
                
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
        print(f"Error initializing Firebase Admin SDK: {str(e)}")
        print(f"Environment variables present: {', '.join(k for k in ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL'] if k in os.environ)}")
        raise
    
    return firebase_admin.get_app()

def get_firestore():
    """Get Firestore client"""
    initialize_firebase_admin()
    return firestore.client()

def get_auth():
    """Get Firebase Auth client"""
    initialize_firebase_admin()  # Ensure initialization
    return auth.Client(app=firebase_admin.get_app())
