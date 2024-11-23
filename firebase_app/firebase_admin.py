import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import os
from pathlib import Path

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        try:
            # Get the absolute path to the service account file
            base_dir = Path(__file__).resolve().parent.parent
            cred_path = base_dir / 'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json'
            
            # Initialize with the service account file
            cred = credentials.Certificate(str(cred_path))
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
