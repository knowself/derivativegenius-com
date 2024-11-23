import json

def format_key_for_vercel():
    json_path = "/home/knowself/Web Dev/derivativegenius-com/dev/dg-website-firebase-adminsdk-ykjsf-f0de62e320.json"
    with open(json_path, 'r') as f:
        creds = json.load(f)
    
    # Get the private key
    key = creds['private_key']
    
    # Format for Vercel (escape newlines)
    vercel_key = key.replace('\n', '\\n')
    
    print("\nFormatted key for Vercel environment variable:")
    print("==============================================")
    print(vercel_key)
    print("\nVerification:")
    print("=============")
    print("Starts with correct header:", vercel_key.startswith('-----BEGIN PRIVATE KEY-----'))
    print("Ends with correct footer:", vercel_key.endswith('-----END PRIVATE KEY-----'))
    print("Contains escaped newlines:", '\\n' in vercel_key)
    print("Length:", len(vercel_key))

if __name__ == '__main__':
    format_key_for_vercel()
