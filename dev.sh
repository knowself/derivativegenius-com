#!/bin/bash

# Source our minimal prompt
source .bash_prompt

# Activate virtual environment
source venv/bin/activate

# Export any environment variables if needed
# export DJANGO_SETTINGS_MODULE=api.settings

# Function to start the server
start_server() {
    echo "Starting Django development server..."
    nodemon --watch "**/*" --ext "py,html,css,js" --exec "python3 manage.py runserver" --signal SIGTERM
}

# Start the server initially
start_server

# Trap Ctrl+R to restart the server
trap 'echo "Restarting server..."; pkill -f "nodemon"; start_server' SIGQUIT

# Keep the script running
while true; do
    sleep 1
done
