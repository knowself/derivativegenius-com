#!/usr/bin/env python3
import sys
import requests
import json
from typing import Dict, List, Tuple

def test_endpoint(url: str, method: str = 'GET', data: Dict = None) -> Tuple[bool, str]:
    """Test an endpoint and return success status and message."""
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        else:
            return False, f"Unsupported method: {method}"

        if response.status_code == 404:
            return False, f"Endpoint not found: {url}"
        elif response.status_code >= 500:
            return False, f"Server error: {response.status_code}"
        elif response.status_code >= 400:
            return False, f"Client error: {response.status_code}"
        
        return True, "Success"
    except requests.exceptions.ConnectionError:
        return False, f"Connection failed: {url}"
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Main test runner."""
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    
    endpoints = [
        # Authentication endpoints
        {"url": f"{base_url}/api/auth/session", "method": "GET"},
        {"url": f"{base_url}/api/auth/signout", "method": "POST"},
        {"url": f"{base_url}/firebase/auth/verify", "method": "POST", 
         "data": {"token": "test_token"}},
        
        # Add more endpoints as needed
    ]
    
    failed = False
    for endpoint in endpoints:
        success, message = test_endpoint(
            endpoint["url"], 
            endpoint.get("method", "GET"),
            endpoint.get("data")
        )
        
        if not success:
            print(f"❌ {endpoint['url']}: {message}")
            failed = True
        else:
            print(f"✅ {endpoint['url']}: OK")
    
    sys.exit(1 if failed else 0)

if __name__ == "__main__":
    main()
