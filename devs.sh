#!/bin/bash

# Source our minimal prompt
source .bash_prompt

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print with timestamp
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

# Print success message
success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

# Print error message
error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if virtual environment exists, if not create it
if [ ! -d "venv" ]; then
    log "Creating Python virtual environment..."
    python3 -m venv venv
    success "Virtual environment created"
fi

# Activate virtual environment
log "Activating virtual environment..."
source venv/bin/activate
success "Virtual environment activated"

# Install/update dependencies
log "Checking Python dependencies..."
pip install -r requirements.txt
success "Python dependencies installed"

log "Checking Node.js dependencies..."
npm install
success "Node.js dependencies installed"

# Function to cleanup processes
cleanup() {
    log "Shutting down development servers..."
    
    # Kill Vue development server
    if [ ! -z "$VUE_PID" ]; then
        kill $VUE_PID 2>/dev/null
        success "Vue server stopped"
    fi
    
    # Kill Django server (managed by nodemon)
    if pgrep -f "nodemon" > /dev/null; then
        pkill -f "nodemon" 2>/dev/null
        success "Django server stopped"
    fi
    
    # Kill any remaining Django processes
    if pgrep -f "runserver" > /dev/null; then
        pkill -f "runserver" 2>/dev/null
    fi
    
    log "Development environment shutdown complete"
    exit 0
}

# Trap Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start Vue development server
log "Starting Vue development server..."
npm run dev &
VUE_PID=$!
success "Vue server started (PID: $VUE_PID)"

# Start Django development server with nodemon for auto-reload
log "Starting Django development server..."
nodemon --watch "**/*" --ext "py,html,css,js" --exec "python3 manage.py runserver" --signal SIGTERM &
DJANGO_PID=$!
success "Django server started (managed by nodemon)"

# Display environment information
log "Development environment is running"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${GREEN}Vue server:${NC} http://localhost:8080"
echo -e "${GREEN}Django server:${NC} http://localhost:8000"
echo -e "${GREEN}Vue PID:${NC} $VUE_PID"
echo -e "${GREEN}Auto-reload:${NC} enabled (nodemon)"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "Press ${GREEN}Ctrl+C${NC} to stop all servers"

# Monitor running processes
while true; do
    # Check if Vue server is still running
    if ! kill -0 $VUE_PID 2>/dev/null; then
        error "Vue server has stopped unexpectedly"
        cleanup
    fi
    
    # Check if Django server is still running
    if ! pgrep -f "nodemon" > /dev/null; then
        error "Django server has stopped unexpectedly"
        cleanup
    fi
    
    sleep 5
done
