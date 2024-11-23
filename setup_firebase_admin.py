import json
import sys
from pathlib import Path

def setup_firebase_admin(service_account_path):
    # Read the service account file
    with open(service_account_path) as f:
        creds = json.load(f)
    
    # Create or update .env file
    env_path = Path('.env')
    
    # Read existing .env content
    existing_env = {}
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    existing_env[key] = value

    # Update with Firebase Admin credentials
    env_vars = {
        'FIREBASE_ADMIN_TYPE': creds['type'],
        'FIREBASE_ADMIN_PROJECT_ID': creds['project_id'],
        'FIREBASE_ADMIN_PRIVATE_KEY_ID': creds['private_key_id'],
        'FIREBASE_ADMIN_PRIVATE_KEY': creds['private_key'],
        'FIREBASE_ADMIN_CLIENT_EMAIL': creds['client_email'],
        'FIREBASE_ADMIN_CLIENT_ID': creds['client_id'],
        'FIREBASE_ADMIN_AUTH_URI': creds['auth_uri'],
        'FIREBASE_ADMIN_TOKEN_URI': creds['token_uri'],
        'FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL': creds['auth_provider_x509_cert_url'],
        'FIREBASE_ADMIN_CLIENT_X509_CERT_URL': creds['client_x509_cert_url'],
        'FIREBASE_ADMIN_UNIVERSE_DOMAIN': creds.get('universe_domain', 'googleapis.com')
    }

    # Merge with existing env vars
    existing_env.update(env_vars)

    # Write back to .env file
    with open(env_path, 'w') as f:
        for key, value in existing_env.items():
            if '\n' in str(value):
                # Handle multiline values (like private key)
                value = str(value).replace('\n', '\\n')
            f.write(f'{key}={value}\n')

    print("Firebase Admin credentials have been added to .env file")
    print("You can now create an admin user using:")
    print("python manage.py create_firebase_admin <email> <password>")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python setup_firebase_admin.py path/to/serviceAccount.json")
        sys.exit(1)
    
    setup_firebase_admin(sys.argv[1])
