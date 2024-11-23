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
    
    try:
        # Try using the JSON file first
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json')
        if os.path.exists(json_path):
            logger.info(f"Initializing Firebase Admin SDK using JSON file: {json_path}")
            cred = credentials.Certificate(json_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
            return
        
        # Fallback to environment variables if JSON file not found
        logger.info("JSON file not found, trying environment variables")
        required_vars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL']
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        
        if missing_vars:
            logger.error("Missing required environment variables: " + ', '.join(missing_vars))
            raise ValueError("Missing required environment variables: " + ', '.join(missing_vars))
        
        project_id = os.environ.get('FIREBASE_PROJECT_ID')
        client_email = os.environ.get('FIREBASE_CLIENT_EMAIL')
        private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
        
        # Handle different possible formats of the private key
        if private_key.startswith('"') and private_key.endswith('"'):
            private_key = private_key[1:-1]
            logger.debug("Removed surrounding quotes from private key")
        
        # Log the key format before any modifications
        logger.debug("Private key before processing:")
        logger.debug("Length: " + str(len(private_key)))
        logger.debug("First 40 chars: " + private_key[:40])
        logger.debug("Last 40 chars: " + private_key[-40:])
        logger.debug("Contains \\n: " + str('\\n' in private_key))
        logger.debug("Contains actual newlines: " + str('\n' in private_key))
        
        # Replace literal \n with actual newlines, but preserve existing newlines
        private_key = private_key.replace('\\n', '\n')
        
        # Log the key format after modifications
        logger.debug("Private key after processing:")
        logger.debug("Length: " + str(len(private_key)))
        logger.debug("First 40 chars: " + private_key[:40])
        logger.debug("Last 40 chars: " + private_key[-40:])
        logger.debug("Contains \\n: " + str('\\n' in private_key))
        logger.debug("Contains actual newlines: " + str('\n' in private_key))
        
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
        
        cred_dict = {
            "type": "service_account",
            "project_id": project_id,
            "private_key": private_key,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token"
        }
        
        # Log the final credential dictionary (without sensitive data)
        logger.debug("Credential dictionary keys: " + str(list(cred_dict.keys())))
        logger.debug("Project ID in cred_dict: " + cred_dict['project_id'])
        logger.debug("Client email in cred_dict: " + cred_dict['client_email'])
        
        logger.info("Creating credentials from dictionary")
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully using environment variables")
        
    except Exception as e:
        logger.error(f"Error initializing Firebase Admin SDK: {str(e)}")
        logger.error("Environment variables present: " + ', '.join([var for var in required_vars if os.environ.get(var)]))
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
