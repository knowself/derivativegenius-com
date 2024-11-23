import os
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, auth
import logging

# Initialize logger
logger = logging.getLogger(__name__)

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK using either local file or environment variables."""
    
    # Check for required environment variables
    required_vars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    try:
        # First try using individual environment variables (production)
        if os.environ.get('FIREBASE_PRIVATE_KEY'):
            private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
            
            # Handle different possible formats of the private key
            if private_key.startswith('"') and private_key.endswith('"'):
                private_key = private_key[1:-1]
            
            # Replace literal \n with actual newlines, but preserve existing newlines
            private_key = private_key.replace('\\n', '\n')
            
            # Ensure the key has the correct PEM format
            if not private_key.startswith('-----BEGIN PRIVATE KEY-----'):
                logger.error("Private key does not have correct PEM header")
                raise ValueError("Invalid private key format")
            
            if not private_key.endswith('-----END PRIVATE KEY-----\n') and not private_key.endswith('-----END PRIVATE KEY-----'):
                logger.error("Private key does not have correct PEM footer")
                raise ValueError("Invalid private key format")
            
            # Ensure the key ends with a newline
            if not private_key.endswith('\n'):
                private_key += '\n'
            
            logger.info("Private key format validation passed")
            logger.debug(f"Key starts with: {private_key.split('\n')[0]}")
            logger.debug(f"Key ends with: {private_key.split('\n')[-2]}")  # -2 to get the last non-empty line
            
            project_id = os.environ.get('FIREBASE_PROJECT_ID')
            client_email = os.environ.get('FIREBASE_CLIENT_EMAIL')
            
            logger.info(f"Initializing Firebase Admin SDK for project: {project_id}")
            
            cred_dict = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key,
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token"
            }
            
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
