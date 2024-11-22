import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        # Create credentials dictionary from environment variables
        cred_dict = {
            "type": os.getenv('FIREBASE_ADMIN_TYPE'),
            "project_id": os.getenv('FIREBASE_ADMIN_PROJECT_ID'),
            "private_key_id": os.getenv('FIREBASE_ADMIN_PRIVATE_KEY_ID'),
            "private_key": os.getenv('FIREBASE_ADMIN_PRIVATE_KEY').replace('\\n', '\n'),
            "client_email": os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL'),
            "client_id": os.getenv('FIREBASE_ADMIN_CLIENT_ID'),
            "auth_uri": os.getenv('FIREBASE_ADMIN_AUTH_URI'),
            "token_uri": os.getenv('FIREBASE_ADMIN_TOKEN_URI'),
            "auth_provider_x509_cert_url": os.getenv('FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL'),
            "client_x509_cert_url": os.getenv('FIREBASE_ADMIN_CLIENT_X509_CERT_URL'),
            "universe_domain": os.getenv('FIREBASE_ADMIN_UNIVERSE_DOMAIN')
        }
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    
    return firebase_admin.get_app()

def get_firestore():
    """Get Firestore client"""
    initialize_firebase_admin()
    return firestore.client()

def get_auth():
    """Get Firebase Auth client"""
    initialize_firebase_admin()
    return auth
