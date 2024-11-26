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
    """Initialize Firebase Admin SDK using either local file or environment variables."""
    
    try:
        # Check if Firebase Admin is already initialized
        try:
            return firebase_admin.get_app()
        except ValueError:
            pass  # Not initialized yet, continue with initialization
        
        # Try using the JSON file first
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json')
        if os.path.exists(json_path):
            logger.info(f"Initializing Firebase Admin SDK using JSON file: {json_path}")
            cred = credentials.Certificate(json_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
            return firebase_admin.get_app()
        
        # Fallback to environment variables from Django settings
        logger.info("JSON file not found, trying Django settings")
        required_vars = [
            'FIREBASE_ADMIN_PROJECT_ID',
            'FIREBASE_ADMIN_PRIVATE_KEY',
            'FIREBASE_ADMIN_CLIENT_EMAIL',
            'FIREBASE_WEB_API_KEY'
        ]
        
        # Get variables from Django settings
        config_vars = {
            'FIREBASE_ADMIN_PROJECT_ID': settings.FIREBASE_ADMIN_PROJECT_ID,
            'FIREBASE_ADMIN_PRIVATE_KEY': settings.FIREBASE_ADMIN_PRIVATE_KEY,
            'FIREBASE_ADMIN_CLIENT_EMAIL': settings.FIREBASE_ADMIN_CLIENT_EMAIL,
            'FIREBASE_WEB_API_KEY': settings.FIREBASE_WEB_API_KEY
        }
        
        missing_vars = [var for var in required_vars if not config_vars.get(var)]
        
        if missing_vars:
            logger.error("Missing required configuration variables: " + ', '.join(missing_vars))
            raise ValueError("Missing required configuration variables: " + ', '.join(missing_vars))
        
        private_key = config_vars['FIREBASE_ADMIN_PRIVATE_KEY']
        
        # Handle different possible formats of the private key
        if private_key.startswith('"') and private_key.endswith('"'):
            private_key = private_key[1:-1]
            logger.debug("Removed surrounding quotes from private key")
        
        # Replace literal \n with actual newlines, but preserve existing newlines
        private_key = private_key.replace('\\n', '\n')
        
        # Ensure the key has the correct PEM format
        if not private_key.startswith('-----BEGIN PRIVATE KEY-----'):
            logger.error("Private key does not have correct PEM header")
            logger.error(f"Key starts with: {private_key[:50]}")
            raise ValueError("Invalid private key format")
        
        if not private_key.endswith('-----END PRIVATE KEY-----\n') and not private_key.endswith('-----END PRIVATE KEY-----'):
            logger.error("Private key does not have correct PEM footer")
            logger.error(f"Key ends with: {private_key[-50:]}")
            raise ValueError("Invalid private key format")
        
        # Ensure the key ends with a newline
        if not private_key.endswith('\n'):
            private_key += '\n'
        
        logger.info("Private key format validation passed")
        
        cred_dict = {
            "type": "service_account",
            "project_id": config_vars['FIREBASE_ADMIN_PROJECT_ID'],
            "private_key": private_key,
            "client_email": config_vars['FIREBASE_ADMIN_CLIENT_EMAIL'],
            "token_uri": "https://oauth2.googleapis.com/token"
        }
        
        logger.info("Creating credentials from dictionary")
        cred = credentials.Certificate(cred_dict)
        
        app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully using Django settings")
        return app
        
    except Exception as e:
        logger.error(f"Error initializing Firebase Admin SDK: {str(e)}")
        logger.error("Configuration variables present: " + ', '.join([var for var in required_vars if config_vars.get(var)]))
        raise

def get_firestore():
    """Get Firestore client"""
    app = initialize_firebase_admin()
    return firestore.client(app=app)

def get_auth():
    """Get Firebase Auth client"""
    app = initialize_firebase_admin()
    return auth.Client(app=app)
