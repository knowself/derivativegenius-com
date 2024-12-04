#!/bin/bash

# Function URL - replace with your actual function URL
FUNCTION_URL="https://us-west1-derivative-genius-website.cloudfunctions.net/sendContactEmail"

# Test data
echo "Sending test request to: $FUNCTION_URL"
echo "Request headers:"
echo "  Content-Type: application/json"
echo "  Origin: http://localhost:8080"
echo "Request body:"
echo '{
    "name": "Test User",
    "email": "joe@derivativegenius.com",
    "message": "This is a test message from the contact form."
}'

# Send request with verbose output
curl -v -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:8080" \
  -d '{
    "name": "Test User",
    "email": "joe@derivativegenius.com",
    "message": "This is a test message from the contact form."
  }'

echo -e "\n\nDone!"
