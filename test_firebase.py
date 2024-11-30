import firebase_admin
from firebase_admin import credentials, auth
import os
import json

def test_firebase_init():
    print("=== Testing Firebase Admin SDK Initialization ===")
    
    # Path to service account JSON file
    json_path = 'dg-website-firebase-adminsdk-ykjsf-f0de62e320.json'
    
    try:
        print(f"Looking for credentials file at: {json_path}")
        if os.path.exists(json_path):
            print("Found credentials file")
            try:
                # Try to initialize Firebase Admin SDK
                print("Initializing Firebase Admin SDK...")
                cred = credentials.Certificate(json_path)
                app = firebase_admin.initialize_app(cred)
                print("Firebase Admin SDK initialized successfully!")
                
                # Try to get auth client
                print("\nTesting auth client...")
                auth_client = auth.Client(app)
                print("Auth client created successfully!")
                
                return True
            except Exception as e:
                print(f"Error initializing Firebase Admin SDK: {str(e)}")
                return False
        else:
            print(f"Credentials file not found at: {json_path}")
            return False
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    test_firebase_init()
