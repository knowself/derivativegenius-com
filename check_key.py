import os
from dotenv import load_dotenv

def check_key_format():
    load_dotenv('.env.local')
    key = os.getenv('FIREBASE_PRIVATE_KEY', '')
    
    checks = {
        'Has correct header': key.startswith('-----BEGIN PRIVATE KEY-----'),
        'Has correct footer': key.endswith('-----END PRIVATE KEY-----'),
        'Contains escaped newlines': '\\n' in key,
        'Contains actual newlines': '\n' in key,
        'Surrounded by quotes': key.startswith('"') and key.endswith('"'),
        'Length': len(key)
    }
    
    for check, result in checks.items():
        print(f'{check}: {result}')

if __name__ == '__main__':
    check_key_format()
