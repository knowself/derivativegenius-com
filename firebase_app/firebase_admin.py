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
    """Initialize Firebase Admin SDK using Django settings."""
    try:
        # Check if Firebase Admin is already initialized
        try:
            app = firebase_admin.get_app()
            logger.info("Firebase Admin SDK already initialized")
            return app
        except ValueError:
            logger.info("Firebase Admin SDK not initialized yet")

        # Get Firebase configuration from Django settings and initialize
        config = settings.FIREBASE_CONFIG
        logger.info("Firebase Config Keys: %s", list(config.keys()))
        logger.info("Project ID: %s", config.get('project_id'))
        logger.info("Client Email: %s", config.get('client_email'))
        logger.info("Private Key ID: %s", config.get('private_key_id'))
        if config.get('private_key'):
            logger.info("Private Key Format: starts=%s, ends=%s", 
                       config['private_key'].startswith('-----BEGIN PRIVATE KEY-----'),
                       config['private_key'].endswith('-----END PRIVATE KEY-----\n'))
            logger.info("Private Key Length: %d", len(config['private_key']))
        else:
            logger.error("Private Key is missing or empty")

        cred = credentials.Certificate(config)
        app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
        return app
            
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
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
