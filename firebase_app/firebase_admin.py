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
            logger.info("Firebase Admin SDK not initialized yet, proceeding with initialization")
        
        # First try using environment variable (production method)
        creds_json = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
        if creds_json:
            try:
                logger.info("Initializing Firebase Admin SDK using environment variables")
                cred_dict = json.loads(creds_json)
                cred = credentials.Certificate(cred_dict)
                app = firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized successfully from environment")
                return app
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Firebase credentials from environment: {e}")
            except ValueError as e:
                logger.error(f"Invalid Firebase credentials from environment: {e}")
        
        # Fallback to JSON file (development method)
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                               'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json')
        
        logger.info(f"Attempting to load Firebase credentials from file: {json_path}")
        if os.path.exists(json_path):
            try:
                logger.info("Loading Firebase Admin SDK credentials from JSON file")
                cred = credentials.Certificate(json_path)
                app = firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized successfully from file")
                return app
            except Exception as e:
                logger.error(f"Failed to initialize Firebase Admin SDK from file: {str(e)}")
                raise
        else:
            logger.error(f"Firebase credentials file not found at: {json_path}")
            raise ValueError(f"Firebase credentials file not found at: {json_path}")
        
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
        logger.error("Firebase configuration:", settings.FIREBASE_CONFIG)
        raise

def get_firestore():
    """Get Firestore client, initializing Firebase if needed."""
    try:
        initialize_firebase_admin()
        return firestore.client()
    except Exception as e:
        logger.error(f"Failed to get Firestore client: {str(e)}")
        raise

def get_auth():
    """Get Firebase Auth instance, initializing Firebase if needed."""
    try:
        initialize_firebase_admin()
        return auth
    except Exception as e:
        logger.error(f"Failed to get Auth instance: {str(e)}")
        raise
