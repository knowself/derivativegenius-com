import os
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, auth
import logging
from django.conf import settings

# Initialize logger
logger = logging.getLogger(__name__)

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK using either environment variables or local file."""
    
    try:
        # Check if Firebase Admin is already initialized
        try:
            return firebase_admin.get_app()
        except ValueError:
            pass  # Not initialized yet, continue with initialization
        
        # First try using environment variable (production method)
        creds_json = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
        if creds_json:
            try:
                logger.info("Initializing Firebase Admin SDK using environment variables")
                cred_dict = json.loads(creds_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized successfully from environment")
                return firebase_admin.get_app()
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Firebase credentials from environment: {e}")
            except ValueError as e:
                logger.error(f"Invalid Firebase credentials from environment: {e}")
        
        # Fallback to JSON file (development method)
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                               'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json')
        if os.path.exists(json_path):
            logger.info(f"Falling back to JSON file for Firebase Admin SDK: {json_path}")
            cred = credentials.Certificate(json_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully from file")
            return firebase_admin.get_app()
        
        raise ValueError("No Firebase credentials found in environment or local file")
        
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        raise

def get_firestore():
    """Get Firestore client, initializing Firebase if needed."""
    initialize_firebase_admin()
    return firestore.client()

def get_auth():
    """Get Firebase Auth client, initializing Firebase if needed."""
    initialize_firebase_admin()
    return auth.client()
