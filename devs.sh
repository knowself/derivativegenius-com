# Development Environment Configuration
# Python: Always use python3 (not python) for all commands
# Node.js: v18.x LTS
# Ports: Vue.js (8080), Django (8000)

#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server port configuration
DJANGO_PORT=8000
VUE_PORT=8080

# Source our minimal prompt
source .bash_prompt

# AI Development Principles
# This check serves as a reminder to developers that this project uses AI assistance
# guided by principles defined in _ai_dev_principles_standards.md
# NOTE: Developers must manually share this file with AI assistants during development
# sessions to ensure the principles are followed.
if [ -f "_ai_dev_principles_standards.md" ]; then
    export AI_PRINCIPLES_FILE="_ai_dev_principles_standards.md"
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} AI development principles file present (remember to share with AI assistants)"
else
    echo -e "${RED}[✗]${NC} AI principles file not found. Please ensure _ai_dev_principles_standards.md exists."
    exit 1
fi

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

# Print warning message
warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Function to check if Django server is running
is_django_running() {
    # First check if process exists
    if pgrep -f "python.*manage.py.*runserver" > /dev/null; then
        # Then verify it's responding, with more lenient timeout
        if curl -s -m 3 -o /dev/null -w "%{http_code}" http://localhost:$DJANGO_PORT/ > /dev/null 2>&1; then
            # Also verify Firebase is initialized by checking the log
            if [ -f django.log ] && tail -n 50 django.log | grep -q "Firebase Admin SDK initialized successfully"; then
                return 0
            elif [ -f django.log ] && tail -n 50 django.log | grep -q "Error initializing Firebase"; then
                return 1
            elif [ -f django.log ] && tail -n 10 django.log | grep -q "Starting development server at"; then
                # Still starting up
                return 0
            fi
        fi
    fi
    return 1
}

# Function to check if Vue server is running
is_vue_running() {
    # First check if the process exists with the right command line
    if pgrep -f "vue-cli-service.*serve" > /dev/null; then
        # Check if webpack is still compiling
        if tail -n 50 vue.log 2>/dev/null | grep -q "webpack compilation"; then
            return 1
        fi
        
        # Try different endpoints that Vue might serve
        for endpoint in "" "index.html" "static/"; do
            if curl -sL -k -m 3 -o /dev/null "http://localhost:$VUE_PORT/$endpoint" > /dev/null 2>&1; then
                return 0
            fi
        done
        
        # If process exists but not responding, check compilation status
        if tail -n 100 vue.log 2>/dev/null | grep -q "Compiled successfully"; then
            # It compiled successfully, just waiting for server
            return 0
        fi
    fi
    return 1
}

# Function to start Django server
start_django() {
    if ! is_django_running; then
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Starting Django server..."
        
        # Ensure virtual environment is activated
        if [ -z "$VIRTUAL_ENV" ]; then
            if [ ! -f "venv/bin/activate" ]; then
                echo -e "${RED}[✗]${NC} Virtual environment not found. Creating one..."
                python3 -m venv venv
            fi
            source venv/bin/activate
            # Export for subprocesses
            export VIRTUAL_ENV
            export PATH="$VIRTUAL_ENV/bin:$PATH"
        fi
        
        # Check Firebase credentials
        if [ ! -f "dg-website-firebase-adminsdk-ykjsf-f0de62e320.json" ]; then
            echo -e "${RED}[✗]${NC} Firebase credentials file not found!"
            return 1
        fi
        
        # Start Django server with proper environment
        PYTHONUNBUFFERED=1 DJANGO_DEBUG=1 python3 manage.py runserver > django.log 2>&1 &
        DJANGO_PID=$!
        export DJANGO_PID
        
        # Give it time to start, checking progress
        local start_time=$(date +%s)
        while true; do
            sleep 1
            current_time=$(date +%s)
            elapsed=$((current_time - start_time))
            
            # Check if process is still running
            if ! kill -0 $DJANGO_PID 2>/dev/null; then
                echo -e "${RED}[✗]${NC} Django process terminated unexpectedly. Last log entries:"
                tail -n 10 django.log
                return 1
            fi
            
            # Check log for different states
            if tail -n 20 django.log | grep -q "Firebase Admin SDK initialized successfully"; then
                echo -e "${GREEN}[✓]${NC} Django server started successfully with Firebase"
                return 0
            elif tail -n 20 django.log | grep -q "Error initializing Firebase"; then
                echo -e "${RED}[✗]${NC} Firebase initialization failed. Check django.log for details:"
                tail -n 10 django.log
                return 1
            elif [ $elapsed -gt 15 ]; then
                echo -e "${RED}[✗]${NC} Django server took too long to initialize. Last log entries:"
                tail -n 10 django.log
                return 1
            fi
            
            # Show progress at intervals
            case $elapsed in
                5)
                    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Waiting for Django to initialize..."
                    ;;
                10)
                    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Still waiting for Firebase initialization..."
                    ;;
            esac
        done
    else
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Django server is already running"
        # Update PID for monitoring
        DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
        export DJANGO_PID
    fi
    return 0
}

# Function to start Vue server
start_vue() {
    if ! is_vue_running; then
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Starting Vue server..."
        
        # First ensure we're in a clean state
        cleanup
        
        # Check npm environment
        if ! command -v npm >/dev/null 2>&1; then
            echo -e "${RED}[✗]${NC} npm not found. Please install Node.js"
            return 1
        fi
        
        # Verify node_modules exists
        if [ ! -d "node_modules" ]; then
            echo -e "${RED}[✗]${NC} node_modules not found. Please run 'npm install' first"
            return 1
        fi
        
        # Clear problematic cache files if they exist
        if [ -d "node_modules/.cache" ]; then
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Clearing webpack cache..."
            find node_modules/.cache -type f -name "*.json" -delete
            find node_modules/.cache -type f -name "*.pack" -delete
        fi
        
        # Preserve important environment variables
        export NODE_ENV=development
        export VUE_CLI_BABEL_TRANSPILE_MODULES=true
        export VUE_CLI_SERVICE_CONFIG_PATH="$(pwd)/vue.config.js"
        
        # Start Vue dev server with preserved environment
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Starting Vue development server..."
        npm run dev > vue.log 2>&1 &
        VUE_PID=$!
        
        # Wait up to 60 seconds for the server to start
        for i in {1..60}; do
            if is_vue_running; then
                echo -e "${GREEN}[✓]${NC} Vue server started successfully"
                return 0
            fi
            sleep 1
            
            # Show progress at intervals
            case $i in
                10)
                    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Still compiling... (this may take a few moments)"
                    tail -n 3 vue.log
                    ;;
                30)
                    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Webpack is still bundling... (large projects may take longer)"
                    tail -n 3 vue.log
                    ;;
                50)
                    echo -e "${YELLOW}[!]${NC} Server startup is taking longer than usual..."
                    tail -n 5 vue.log
                    ;;
            esac
            
            # Check for common errors in the log
            if grep -q "Error:" vue.log 2>/dev/null; then
                echo -e "${RED}[✗]${NC} Vue server failed to start. Found error in logs:"
                grep -A 5 "Error:" vue.log | head -n 6
                cleanup
                return 1
            fi
        done
        
        echo -e "${RED}[✗]${NC} Vue server failed to start within 60 seconds"
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Last 10 lines of vue.log:"
        tail -n 10 vue.log
        cleanup
        return 1
    else
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Vue server is already running"
    fi
    return 0
}

# Function to check servers health
check_health() {
    local django_status="not running"
    local vue_status="not running"
    
    if is_django_running; then
        django_status="${GREEN}running${NC} (http://localhost:$DJANGO_PORT)"
    else
        django_status="${RED}not running${NC}"
    fi
    
    if is_vue_running; then
        vue_status="${GREEN}running${NC} (http://localhost:$VUE_PORT)"
    else
        vue_status="${RED}not running${NC}"
    fi
    
    echo -e "\n${BLUE}Server Status:${NC}"
    echo -e "Django:  $django_status"
    echo -e "Vue.js:  $vue_status\n"
    
    # Return success only if both servers are running
    if is_django_running && is_vue_running; then
        return 0
    fi
    return 1
}

# Function to start servers
start_servers() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Starting servers..."
    
    # Start Vue server first since it takes longer to compile
    if ! start_vue; then
        echo -e "${RED}[✗]${NC} Failed to start Vue server"
        return 1
    fi
    
    # Start Django server
    if ! start_django; then
        echo -e "${RED}[✗]${NC} Failed to start Django server"
        cleanup  # Clean up Vue server if Django fails
        return 1
    fi
    
    echo -e "${GREEN}[✓]${NC} All servers started successfully"
    return 0
}

# Function to cleanup processes
cleanup() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Stopping servers..."
    
    # Kill Vue CLI process and any related Node processes
    pkill -f "vue-cli-service serve" 2>/dev/null
    pkill -f "webpack" 2>/dev/null
    pkill -f "node.*@vue/cli-service" 2>/dev/null
    
    # Kill Django/nodemon processes
    pkill -f "runserver" 2>/dev/null
    pkill -f "nodemon.*runserver" 2>/dev/null
    
    # Wait for processes to stop
    sleep 2

    # Double check and force kill if needed
    if pgrep -f "vue-cli-service serve" >/dev/null || pgrep -f "runserver" >/dev/null || pgrep -f "node.*@vue/cli-service" >/dev/null; then
        pkill -9 -f "vue-cli-service serve" 2>/dev/null
        pkill -9 -f "webpack" 2>/dev/null
        pkill -9 -f "node.*@vue/cli-service" 2>/dev/null
        pkill -9 -f "runserver" 2>/dev/null
        pkill -9 -f "nodemon.*runserver" 2>/dev/null
        sleep 1
    fi

    # Clean up any stale port bindings
    if command -v fuser >/dev/null 2>&1; then
        fuser -k $VUE_PORT/tcp 2>/dev/null || true
        fuser -k $DJANGO_PORT/tcp 2>/dev/null || true
    fi
}

# Function to restart servers
restart_servers() {
    local from_where=$1
    
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Restarting development servers..."
    
    # First stop all servers
    cleanup
    
    # Start Vue first
    if ! start_vue; then
        echo -e "${RED}[✗]${NC} Failed to restart Vue server"
        return 1
    fi
    
    # Then start Django
    if ! start_django; then
        echo -e "${RED}[✗]${NC} Failed to restart Django server"
        cleanup  # Clean up Vue server if Django fails
        return 1
    fi
    
    echo -e "${GREEN}[✓]${NC} Servers restarted successfully"
    
    # Only enter interactive mode if not called from interactive mode
    if [ "$from_where" != "from_interactive" ]; then
        start_interactive
    fi
    return 0
}

# Function to test Django
test_django() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Testing Django server..."
    
    # First check if Django process is running
    if ! pgrep -f "python.*manage.py.*runserver" > /dev/null; then
        echo -e "${RED}[✗]${NC} Django server process is not running"
        return 1
    fi
    
    # Test multiple Django endpoints
    local endpoints=(
        "/"
        "/admin/"
        "/api/test"
    )
    
    local all_passed=true
    echo -e "\n${BLUE}Testing Django endpoints:${NC}"
    
    for endpoint in "${endpoints[@]}"; do
        echo -n "Testing $endpoint ... "
        response=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT$endpoint -o /tmp/django_response.txt)
        body=$(cat /tmp/django_response.txt)
        rm -f /tmp/django_response.txt
        
        if [[ "$response" =~ ^(200|302|301|303)$ ]]; then
            echo -e "${GREEN}OK${NC} (Status: $response)"
        else
            echo -e "${RED}FAILED${NC} (Status: $response)"
            if [ ! -z "$body" ]; then
                echo -e "${RED}Error: $body${NC}"
            fi
            all_passed=false
        fi
    done
    
    # Test Django admin interface accessibility
    echo -n "Testing Django admin interface ... "
    if curl -s http://localhost:$DJANGO_PORT/admin/ | grep -q "Django administration"; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}FAILED${NC}"
        all_passed=false
    fi
    
    # Test Django static files
    echo -n "Testing static files ... "
    if curl -s -I http://localhost:$DJANGO_PORT/static/admin/css/base.css | grep -q "200 OK"; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}FAILED${NC}"
        all_passed=false
    fi
    
    echo ""
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}[✓]${NC} All Django tests passed successfully"
        return 0
    else
        echo -e "${RED}[✗]${NC} Some Django tests failed"
        return 1
    fi
}

# Function to test Firebase connection
test_firebase() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Testing Firebase connection..."
    
    # Try to connect to Django endpoint that uses Firebase
    response_code=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT/firebase/firebase-test/ -o /tmp/firebase_response.txt)
    response_body=$(cat /tmp/firebase_response.txt)
    rm -f /tmp/firebase_response.txt
    
    if [ "$response_code" = "200" ]; then
        echo -e "${GREEN}[✓]${NC} Firebase test passed: Connection is working"
        echo -e "${GREEN}Response:${NC} $response_body"
        return 0
    else
        echo -e "${RED}[✗]${NC} Firebase test failed: Server returned status $response_code"
        if [ ! -z "$response_body" ]; then
            echo -e "${RED}Error details: $response_body${NC}"
        fi
        if [ "$response_code" = "500" ]; then
            echo -e "${RED}[✗]${NC} This might be a Firebase configuration issue. Check your credentials and permissions."
        elif [ "$response_code" = "404" ]; then
            echo -e "${RED}[✗]${NC} Firebase test endpoint not found. Please ensure the API endpoint exists."
        fi
        return 1
    fi
}

# Function to handle interactive commands
handle_command() {
    local cmd="$1"
    case "$cmd" in
        r)
            restart_servers "from_interactive"
            start_interactive
            ;;
        h)
            check_health
            ;;
        d)
            test_django
            ;;
        f)
            test_firebase
            ;;
        detach)
            echo -e "${GREEN}[✓]${NC} Detaching from servers. Servers will continue running in the background."
            echo -e "${GREEN}[✓]${NC} Use './devs.sh' to reattach to the servers"
            exit 0
            ;;
        q|exit)
            cleanup
            echo -e "${GREEN}[✓]${NC} Servers stopped successfully"
            exit 0
            ;;
        ""|*)
            echo -e "${BLUE}Here are the options:${NC}"
            echo -e "  ${YELLOW}r${NC}      - restart servers"
            echo -e "  ${YELLOW}h${NC}      - check health"
            echo -e "  ${YELLOW}d${NC}      - test Django"
            echo -e "  ${YELLOW}f${NC}      - test Firebase"
            echo -e "  ${YELLOW}detach${NC} - detach from servers (leave them running)"
            echo -e "  ${YELLOW}q${NC}      - quit and stop servers"
            ;;
    esac
}

# Function to start interactive mode
start_interactive() {
    echo -e "${GREEN}[✓]${NC} Interactive mode started. Type 'detach' to leave servers running in background."
    # Use read with timeout to check for both input and server status
    while true; do
        read -t 5 -r cmd
        if [ $? -eq 0 ]; then
            # Command was entered
            handle_command "$cmd"
        else
            # No command entered (timeout), check server status
            VUE_RUNNING=false
            DJANGO_RUNNING=false
            
            # Check Vue server
            if kill -0 $VUE_PID 2>/dev/null && curl -sL -k -m 3 -o /dev/null http://localhost:$VUE_PORT/ > /dev/null 2>&1; then
                VUE_RUNNING=true
            fi
            
            # Check Django server with PID and Firebase
            if [ -n "$DJANGO_PID" ] && kill -0 $DJANGO_PID 2>/dev/null; then
                if curl -s -m 3 -o /dev/null http://localhost:$DJANGO_PORT/ > /dev/null 2>&1; then
                    if tail -n 50 django.log | grep -q "Firebase Admin SDK initialized successfully"; then
                        DJANGO_RUNNING=true
                    elif tail -n 50 django.log | grep -q "Error initializing Firebase"; then
                        echo -e "${RED}[✗]${NC} Firebase initialization failed"
                        tail -n 10 django.log
                    elif tail -n 10 django.log | grep -q "Starting development server at"; then
                        # Still starting up
                        DJANGO_RUNNING=true
                    fi
                fi
            fi
            
            # Report any failures
            if ! $VUE_RUNNING || ! $DJANGO_RUNNING; then
                if ! $VUE_RUNNING; then
                    echo -e "${RED}[✗]${NC} Vue server stopped unexpectedly"
                    tail -n 5 vue.log
                fi
                if ! $DJANGO_RUNNING; then
                    echo -e "${RED}[✗]${NC} Django server stopped unexpectedly"
                    tail -n 10 django.log
                fi
                echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Stopping all servers..."
                cleanup
                exit 1
            fi
        fi
    done
}

# Function to check if servers are running
check_running() {
    # More thorough check for Vue process
    if pgrep -f "vue-cli-service serve" >/dev/null; then
        # Also verify it's responding
        if curl -sL -k -m 3 -o /dev/null http://localhost:$VUE_PORT/ > /dev/null 2>&1; then
            # Vue is running and responding
            if pgrep -f "runserver" >/dev/null; then
                # Both servers are running
                return 0
            fi
        fi
    fi
    # One or both servers are not running properly
    return 1
}

# Function to attach to running servers
attach_to_servers() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Checking for running servers..."
    
    # Find Vue process
    VUE_PID=$(pgrep -f "vue-cli-service.*serve" | head -n1)
    if [ -z "$VUE_PID" ]; then
        echo -e "${RED}[✗]${NC} Vue server is not running"
        return 1
    fi
    
    # Find Django process
    DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
    if [ -z "$DJANGO_PID" ]; then
        echo -e "${RED}[✗]${NC} Django server is not running"
        return 1
    fi
    
    # Verify servers are responding
    if ! check_running; then
        echo -e "${RED}[✗]${NC} Servers are not responding properly"
        return 1
    fi
    
    echo -e "${GREEN}[✓]${NC} Found running servers:"
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Vue server (PID: $VUE_PID)"
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Django server (PID: $DJANGO_PID)"
    
    # Start interactive mode
    start_interactive
}

# Trap Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Process command line arguments
case "$1" in
    r|restart)
        if check_running; then
            # Get the script's directory
            SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
            cd "$SCRIPT_DIR"
            
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Servers are running, restarting for a fresh session..."
            restart_servers "from_cli"
            start_interactive
        else
            echo -e "${RED}[✗]${NC} No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    h|health)
        if check_running; then
            check_health
            start_interactive
        else
            echo -e "${RED}[✗]${NC} No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    attach)
        if check_running; then
            # Get the script's directory
            SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
            cd "$SCRIPT_DIR"
            
            # Find existing PIDs
            VUE_PID=$(pgrep -f "vue-cli-service.*serve" | head -n1)
            DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
            
            echo -e "${GREEN}[✓]${NC} Found running servers:"
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Vue server (PID: $VUE_PID)"
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Django server (PID: $DJANGO_PID)"
            
            # Start interactive mode
            start_interactive
        else
            echo -e "${RED}[✗]${NC} No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    help|--help|-h)
        echo -e "${BLUE}Development Server Control Script${NC}"
        echo -e "\nUsage:"
        echo -e "  ${YELLOW}./devs.sh${NC}           - Start servers and enter interactive mode"
        echo -e "  ${YELLOW}./devs.sh attach${NC}    - Attach to running servers"
        echo -e "  ${YELLOW}./devs.sh restart${NC}   - Restart running servers"
        echo -e "  ${YELLOW}./devs.sh health${NC}    - Check servers health"
        echo -e "  ${YELLOW}./devs.sh help${NC}      - Show this help message"
        echo -e "\nInteractive Commands:"
        echo -e "  ${YELLOW}r${NC}      - restart servers"
        echo -e "  ${YELLOW}h${NC}      - check health"
        echo -e "  ${YELLOW}d${NC}      - test Django"
        echo -e "  ${YELLOW}f${NC}      - test Firebase"
        echo -e "  ${YELLOW}detach${NC} - detach from servers (leave them running)"
        echo -e "  ${YELLOW}q${NC}      - quit and stop servers"
        exit 0
        ;;
    *)
        # Always ensure clean slate before starting
        if check_running; then
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Existing servers found, restarting for a fresh session..."
            cleanup
        fi

        # Check if virtual environment exists, if not create it
        if [ ! -d "venv" ]; then
            echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Creating Python virtual environment..."
            python3 -m venv venv
            echo -e "${GREEN}[✓]${NC} Virtual environment created"
        fi

        # Activate virtual environment
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Activating virtual environment..."
        source venv/bin/activate
        echo -e "${GREEN}[✓]${NC} Virtual environment activated"

        # Install/update dependencies
        echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} Checking dependencies..."
        pip install -q -r requirements.txt >/dev/null 2>&1
        echo -e "${GREEN}[✓]${NC} Python dependencies installed"

        npm install --silent >/dev/null 2>&1
        echo -e "${GREEN}[✓]${NC} Node.js dependencies installed"

        # Start servers and enter interactive mode
        start_servers
        start_interactive
        ;;
esac
