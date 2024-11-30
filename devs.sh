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
        # Then verify it's responding by checking health endpoint
        if curl -s -m 3 -o /dev/null -w "%{http_code}" http://localhost:$DJANGO_PORT/health/ 2>/dev/null | grep -q "200"; then
            # Also verify Firebase is initialized
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
    local VUE_PORT=${VUE_PORT:-8080}
    local MAX_RETRIES=3
    local RETRY_COUNT=0
    
    # First check if the process exists
    VUE_PID=$(pgrep -f "vue-cli-service.*serve")
    if [ -z "$VUE_PID" ]; then
        return 1
    fi
    
    # Check if port is being listened on
    if ! netstat -tlpn 2>/dev/null | grep -q ":$VUE_PORT.*LISTEN.*$VUE_PID/node"; then
        return 1
    fi
    
    # Try direct connection to Vue dev server port
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if timeout 2 bash -c "echo > /dev/tcp/localhost/$VUE_PORT" 2>/dev/null; then
            # Port is accepting connections, now check Django health endpoint
            if curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/health/" 2>/dev/null | grep -q "200"; then
                return 0
            fi
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 1
        
        # Show progress at intervals
        case $RETRY_COUNT in
            1)
                log "Still compiling... (this may take a few moments)"
                tail -n 3 vue.log
                ;;
            2)
                log "Webpack is still bundling... (large projects may take longer)"
                tail -n 3 vue.log
                ;;
            3)
                warn "Server startup is taking longer than usual..."
                tail -n 5 vue.log
                ;;
        esac
        
        # Check for common errors in the log
        if grep -q "Error:" vue.log 2>/dev/null; then
            error "Vue server failed to start. Found error in logs:"
            grep -A 5 "Error:" vue.log | head -n 6
            cleanup
            return 1
        fi
    done
    
    # If we got here, port checks failed
    # Fall back to log file checks as last resort
    if [ -f vue.log ]; then
        if tail -n 100 vue.log 2>/dev/null | grep -q "Compiled successfully" && \
           ! tail -n 50 vue.log 2>/dev/null | grep -q "webpack compilation"; then
            return 0
        fi
    fi
    
    return 1
}

# Function to check if Redis is running
is_redis_running() {
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli ping >/dev/null 2>&1; then
            return 0  # Redis is running
        else
            error "Redis server is not running"
            log "Run: ${YELLOW}sudo service redis-server start${NC}"
            log "Redis must be running before starting development servers"
            log "If Redis is not installed, run: ${YELLOW}sudo apt-get install redis-server${NC}"
            return 1
        fi
    else
        error "Redis CLI is not installed"
        log "Run: ${YELLOW}sudo apt-get install redis-server${NC}"
        return 1
    fi
}

# Function to check if Celery worker is running
is_celery_running() {
    if pgrep -f "celery.*-A.*api.*worker" > /dev/null; then
        # Verify it's actually responding
        if celery -A api inspect ping 2>/dev/null | grep -q "pong"; then
            return 0
        fi
    fi
    return 1
}

# Function to check if Celery beat is running
is_celery_beat_running() {
    if pgrep -f "celery.*-A.*api.*beat" > /dev/null; then
        return 0
    fi
    return 1
}

# Function to start Django server
start_django() {
    if ! is_django_running; then
        log "Starting Django server..."
        
        # Ensure virtual environment is activated
        if [ -z "$VIRTUAL_ENV" ]; then
            if [ ! -f "venv/bin/activate" ]; then
                error "Virtual environment not found. Creating one..."
                python3 -m venv venv
            fi
            source venv/bin/activate
            # Export for subprocesses
            export VIRTUAL_ENV
            export PATH="$VIRTUAL_ENV/bin:$PATH"
        fi
        
        # Install/update dependencies if needed
        if [ ! -f ".deps_installed" ] || [ requirements.txt -nt ".deps_installed" ]; then
            log "Installing/updating Python dependencies..."
            pip install -r requirements.txt
            touch ".deps_installed"
        fi
        
        # Check Firebase credentials
        if [ ! -f "dg-website-firebase-adminsdk-ykjsf-f0de62e320.json" ]; then
            error "Firebase credentials file not found!"
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
                error "Django process terminated unexpectedly. Last log entries:"
                tail -n 10 django.log
                return 1
            fi
            
            # Check health endpoint
            if curl -s -o /dev/null -w "%{http_code}" http://localhost:$DJANGO_PORT/health/ 2>/dev/null | grep -q "200"; then
                success "Django server started successfully"
                return 0
            elif [ $elapsed -gt 15 ]; then
                error "Django server took too long to initialize. Last log entries:"
                tail -n 10 django.log
                return 1
            fi
            
            # Show progress at intervals
            case $elapsed in
                5)
                    log "Waiting for Django to initialize..."
                    ;;
                10)
                    log "Still waiting for health check to pass..."
                    ;;
            esac
        done
    else
        log "Django server is already running"
        # Update PID for monitoring
        DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
        export DJANGO_PID
    fi
    return 0
}

# Function to start Vue server
start_vue() {
    if ! is_vue_running; then
        log "Starting Vue server..."
        
        # First ensure we're in a clean state, but skip cache cleanup
        export SKIP_CACHE_CLEANUP=1
        cleanup
        unset SKIP_CACHE_CLEANUP
        
        # Check npm environment
        if ! command -v npm >/dev/null 2>&1; then
            error "npm not found. Please install Node.js"
            return 1
        fi
        
        # Verify node_modules exists
        if [ ! -d "node_modules" ]; then
            error "node_modules not found. Please run 'npm install' first"
            return 1
        fi
        
        # Clear problematic cache files if they exist
        if [ -d "node_modules/.cache" ]; then
            log "Clearing webpack cache..."
            rm -rf node_modules/.cache/* 2>/dev/null || true
        fi
        
        # Preserve important environment variables
        export NODE_ENV=development
        export VUE_CLI_BABEL_TRANSPILE_MODULES=true
        export VUE_CLI_SERVICE_CONFIG_PATH="$(pwd)/vue.config.js"
        
        # Start Vue dev server with preserved environment
        log "Starting Vue development server..."
        npm run dev > vue.log 2>&1 &
        VUE_PID=$!
        
        # Wait up to 60 seconds for the server to start
        for i in {1..60}; do
            if is_vue_running; then
                success "Vue server started successfully"
                return 0
            fi
            sleep 1
            
            # Show progress at intervals
            case $i in
                10)
                    log "Still compiling... (this may take a few moments)"
                    tail -n 3 vue.log
                    ;;
                30)
                    log "Webpack is still bundling... (large projects may take longer)"
                    tail -n 3 vue.log
                    ;;
                50)
                    warn "Server startup is taking longer than usual..."
                    tail -n 5 vue.log
                    ;;
            esac
            
            # Check for common errors in the log
            if grep -q "Error:" vue.log 2>/dev/null; then
                error "Vue server failed to start. Found error in logs:"
                grep -A 5 "Error:" vue.log | head -n 6
                export SKIP_CACHE_CLEANUP=1
                cleanup
                unset SKIP_CACHE_CLEANUP
                return 1
            fi
        done
        
        error "Vue server failed to start within 60 seconds"
        log "Last 10 lines of vue.log:"
        tail -n 10 vue.log
        export SKIP_CACHE_CLEANUP=1
        cleanup
        unset SKIP_CACHE_CLEANUP
        return 1
    else
        log "Vue server is already running"
    fi
    return 0
}

# Function to start Celery worker
start_celery() {
    if is_celery_running; then
        warn "Celery worker is already running"
        return 0
    fi

    # First check if Redis is running
    if ! is_redis_running; then
        return 1
    fi

    log "Starting Celery worker..."
    celery -A api worker -l INFO > celery.log 2>&1 &
    CELERY_PID=$!
    
    # Give it time to start
    local start_time=$(date +%s)
    while true; do
        sleep 1
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if ! kill -0 $CELERY_PID 2>/dev/null; then
            error "Celery worker process terminated unexpectedly. Last log entries:"
            tail -n 10 celery.log
            return 1
        fi
        
        if is_celery_running; then
            success "Celery worker started successfully"
            return 0
        elif [ $elapsed -gt 10 ]; then
            error "Celery worker took too long to initialize. Last log entries:"
            tail -n 10 celery.log
            return 1
        fi
    done
}

# Function to start Celery beat
start_celery_beat() {
    if is_celery_beat_running; then
        warn "Celery beat is already running"
        return 0
    fi

    log "Starting Celery beat..."
    celery -A api beat -l INFO > celery_beat.log 2>&1 &
    CELERY_BEAT_PID=$!
    
    # Give it time to start
    local start_time=$(date +%s)
    while true; do
        sleep 1
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if ! kill -0 $CELERY_BEAT_PID 2>/dev/null; then
            error "Celery beat process terminated unexpectedly. Last log entries:"
            tail -n 10 celery_beat.log
            return 1
        fi
        
        if is_celery_beat_running; then
            success "Celery beat started successfully"
            return 0
        elif [ $elapsed -gt 10 ]; then
            error "Celery beat took too long to initialize. Last log entries:"
            tail -n 10 celery_beat.log
            return 1
        fi
    done
}

# Function to check servers health
check_health() {
    local ALL_HEALTHY=true

    # Check Redis
    if is_redis_running; then
        success "Redis server is running"
    else
        ALL_HEALTHY=false
    fi

    # Check Django
    if curl -s http://localhost:$DJANGO_PORT/ >/dev/null 2>&1; then
        success "Django server is running"
    else
        error "Django server is not responding"
        ALL_HEALTHY=false
    fi

    # Check Vue
    if curl -s http://localhost:$VUE_PORT/ >/dev/null 2>&1; then
        success "Vue server is running"
    else
        error "Vue server is not responding"
        ALL_HEALTHY=false
    fi

    # Check Celery worker
    if is_celery_running; then
        success "Celery worker is running"
    else
        error "Celery worker is not running"
        ALL_HEALTHY=false
    fi

    # Check Celery beat
    if is_celery_beat_running; then
        success "Celery beat is running"
    else
        error "Celery beat is not running"
        ALL_HEALTHY=false
    fi

    if $ALL_HEALTHY; then
        success "All services are healthy"
        return 0
    else
        error "Some services are not healthy"
        return 1
    fi
}

# Function to start servers
start_servers() {
    log "Starting servers..."
    
    # Check Redis first since it's required
    if ! is_redis_running; then
        error "Redis must be running before starting servers"
        return 1
    fi
    
    # Start Vue server since it takes longer to compile
    if ! start_vue; then
        error "Failed to start Vue server"
        return 1
    fi
    
    # Start Django server
    if ! start_django; then
        error "Failed to start Django server"
        cleanup  # Clean up Vue server if Django fails
        return 1
    fi
    
    # Start Celery worker and beat
    if ! start_celery; then
        error "Failed to start Celery worker"
        return 1
    fi
    if ! start_celery_beat; then
        error "Failed to start Celery beat"
        return 1
    fi
    
    success "All servers started successfully"
    return 0
}

# Function to cleanup processes
cleanup() {
    # Prevent recursive cleanup
    if [ "${CLEANUP_IN_PROGRESS:-}" = "1" ]; then
        return 0
    fi
    export CLEANUP_IN_PROGRESS=1
    
    log "Cleaning up processes..."
    
    # Kill Django server
    if pgrep -f "python.*manage.py.*runserver" > /dev/null; then
        log "Stopping Django server..."
        pkill -f "python.*manage.py.*runserver"
        sleep 1
        pkill -9 -f "python.*manage.py.*runserver" 2>/dev/null || true
    fi
    
    # Kill Vue development server and webpack processes
    if pgrep -f "vue-cli-service.*serve" > /dev/null || pgrep -f "webpack" > /dev/null; then
        log "Stopping Vue and webpack processes..."
        pkill -f "vue-cli-service.*serve"
        pkill -f "webpack"
        sleep 1
        pkill -9 -f "vue-cli-service.*serve" 2>/dev/null || true
        pkill -9 -f "webpack" 2>/dev/null || true
    fi
    
    # Kill Celery worker and beat
    if pgrep -f "celery.*-A.*api.*worker" > /dev/null || pgrep -f "celery.*-A.*api.*beat" > /dev/null; then
        log "Stopping Celery processes..."
        pkill -f "celery.*-A.*api.*worker"
        pkill -f "celery.*-A.*api.*beat"
        sleep 1
        pkill -9 -f "celery.*-A.*api.*worker" 2>/dev/null || true
        pkill -9 -f "celery.*-A.*api.*beat" 2>/dev/null || true
    fi
    
    # Clean up ports if needed
    if command -v fuser >/dev/null 2>&1; then
        fuser -k $DJANGO_PORT/tcp 2>/dev/null || true
        fuser -k $VUE_PORT/tcp 2>/dev/null || true
    fi
    
    # Clean webpack cache
    if [ "${SKIP_CACHE_CLEANUP:-}" != "1" ]; then
        log "Cleaning webpack cache..."
        rm -rf node_modules/.cache .cache dist 2>/dev/null || true
    fi
    
    # Rotate log files instead of removing them
    mkdir -p ./logs_dev_old
    for log in django.log vue.log celery.log celery_beat.log webpack.log; do
        if [ -f "$log" ]; then
            mv "$log" "./logs_dev_old/${log}.old-$(date +'%H:%M:%S')" 2>/dev/null || true
        fi
        touch "$log" 2>/dev/null || true
    done
    
    # Reset cleanup flag
    export CLEANUP_IN_PROGRESS=0
    success "Cleanup completed"
}

# Function to restart servers
restart_servers() {
    local from_where=$1
    
    log "Restarting development servers..."
    
    # First stop all servers
    cleanup
    
    # Check Redis first since it's required
    if ! is_redis_running; then
        error "Redis must be running before starting servers"
        return 1
    fi
    
    # Start Vue server first
    if ! start_vue; then
        error "Failed to restart Vue server"
        return 1
    fi
    
    # Then start Django
    if ! start_django; then
        error "Failed to restart Django server"
        cleanup  # Clean up Vue server if Django fails
        return 1
    fi
    
    # Start Celery worker and beat
    if ! start_celery; then
        error "Failed to restart Celery worker"
        return 1
    fi
    if ! start_celery_beat; then
        error "Failed to restart Celery beat"
        return 1
    fi
    
    success "Servers restarted successfully"
    
    # Only enter interactive mode if not called from interactive mode
    if [ "$from_where" != "from_interactive" ]; then
        start_interactive
    fi
    return 0
}

# Function to test Django
test_django() {
    log "Testing Django server..."
    
    # First check if Django process is running
    if ! pgrep -f "python.*manage.py.*runserver" > /dev/null; then
        error "Django server process is not running"
        return 1
    fi
    
    # Test multiple Django endpoints
    local endpoints=(
        "/"
        "/admin/"
        "/api/test"
    )
    
    local all_passed=true
    log "\nTesting Django endpoints:"
    
    for endpoint in "${endpoints[@]}"; do
        log "Testing $endpoint ... "
        response=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT$endpoint -o /tmp/django_response.txt)
        body=$(cat /tmp/django_response.txt)
        rm -f /tmp/django_response.txt
        
        if [[ "$response" =~ ^(200|302|301|303)$ ]]; then
            success "OK (Status: $response)"
        else
            error "FAILED (Status: $response)"
            if [ ! -z "$body" ]; then
                error "Error: $body"
            fi
            all_passed=false
        fi
    done
    
    # Test Django admin interface accessibility
    log "Testing Django admin interface ... "
    response=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT/admin/ -o /tmp/admin_response.txt)
    if [[ "$response" =~ ^(200|302|301|303)$ ]]; then
        success "OK (Status: $response)"
    else
        error "FAILED (Status: $response)"
        all_passed=false
    fi
    
    # Test Firebase Configuration
    log "Testing Firebase Configuration ... "
    python3 manage.py shell -c "
from django.conf import settings
import json

# Get Firebase config
firebase_config = getattr(settings, 'FIREBASE_CONFIG', {})

print('\nFirebase Configuration Structure:')
print('Expected structure in settings.py:')
print('''
FIREBASE_CONFIG = {
    'project_id': 'your-project-id',
    'web_api_key': 'your-web-api-key',
    'client_email': 'your-client-email@project.iam.gserviceaccount.com',
    'private_key': 'your-private-key'
}
''')

print('\nCurrent Configuration Status:')
for key, settings_key in [
    ('project_id', 'project_id'),
    ('web_api_key', 'web_api_key'),
    ('client_email', 'admin_client_email'),
    ('private_key', 'admin_private_key')
]:
    value = firebase_config.get(settings_key, '')
    if value:
        if key in ['project_id', 'web_api_key']:
            print(f'- {key}: Valid')
            print(f'  Current value: {value}')
        else:
            print(f'- {key}: Valid (value hidden)')
    else:
        print(f'- {key}: Not configured')

print('\nEnvironment Variables Check:')
import os
env_vars = {
    'FIREBASE_ADMIN_PROJECT_ID': os.getenv('FIREBASE_ADMIN_PROJECT_ID'),
    'FIREBASE_WEB_API_KEY': os.getenv('FIREBASE_WEB_API_KEY'),
    'FIREBASE_ADMIN_CLIENT_EMAIL': os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL'),
    'FIREBASE_ADMIN_PRIVATE_KEY': os.getenv('FIREBASE_ADMIN_PRIVATE_KEY')
}
for key, value in env_vars.items():
    if value:
        if key in ['FIREBASE_ADMIN_PROJECT_ID', 'FIREBASE_WEB_API_KEY']:
            print(f'- {key}: Valid (Value: {value})')
        else:
            print(f'- {key}: Valid (value hidden)')
    else:
        print(f'- {key}: Not configured')

print('\nDebug Tips:')
print('1. Ensure your .env file contains all required Firebase variables')
print('2. Check that settings.py is loading environment variables correctly')
print('3. Verify that project_id and web_api_key match your Firebase console')
"
    if [ $? -eq 0 ]; then
        success "Firebase configuration check completed"
    else
        error "Failed to check Firebase configuration"
        all_passed=false
    fi
    
    # Test Django static files
    log "Testing static files ... "
    if curl -s -I http://localhost:$DJANGO_PORT/static/admin/css/base.css | grep -q "200 OK"; then
        success "OK"
    else
        error "FAILED"
        all_passed=false
    fi
    
    log ""
    if [ "$all_passed" = true ]; then
        success "All Django tests passed successfully"
        return 0
    else
        error "Some Django tests failed"
        return 1
    fi
}

# Function to test Firebase connection
test_firebase() {
    log "Testing Firebase connection..."
    
    # Test Firebase configuration first
    log "Checking Firebase configuration..."
    response_code=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT/firebase/config-test/ -o /tmp/firebase_config.txt)
    config_response=$(cat /tmp/firebase_config.txt)
    rm -f /tmp/firebase_config.txt
    
    if [ "$response_code" != "200" ]; then
        error "Firebase configuration test failed: Server returned status $response_code"
        if [ ! -z "$config_response" ]; then
            error "Configuration error: $config_response"
        fi
        error "Please check your Firebase credentials in settings.py and environment variables"
        return 1
    fi
    
    # Test Firebase authentication
    log "Testing Firebase authentication..."
    response_code=$(curl -s -w "%{http_code}" http://localhost:$DJANGO_PORT/firebase/auth-test/ -o /tmp/firebase_auth.txt)
    auth_response=$(cat /tmp/firebase_auth.txt)
    rm -f /tmp/firebase_auth.txt
    
    if [ "$response_code" != "200" ]; then
        error "Firebase authentication test failed: Server returned status $response_code"
        if [ ! -z "$auth_response" ]; then
            error "Authentication error: $auth_response"
        fi
        if [ "$response_code" = "500" ]; then
            if echo "$auth_response" | grep -q "Invalid JWT Signature"; then
                error "Invalid JWT signature detected. This usually means:"
                error "1. The Firebase private key is truncated or malformed"
                error "2. The environment variables are not properly set"
                error "3. The Firebase project settings don't match the credentials"
                log "Checking environment variables..."
                if [ -z "$FIREBASE_PRIVATE_KEY" ]; then
                    error "FIREBASE_PRIVATE_KEY is not set"
                else
                    success "FIREBASE_PRIVATE_KEY is set"
                fi
                if [ -z "$FIREBASE_PROJECT_ID" ]; then
                    error "FIREBASE_PROJECT_ID is not set"
                else
                    success "FIREBASE_PROJECT_ID is set"
                fi
            fi
        fi
        return 1
    fi
    
    success "Firebase tests passed successfully"
    log "Configuration: $config_response"
    log "Authentication: $auth_response"
    return 0
}

# Function to test Redis
test_redis() {
    log "Testing Redis connection..."
    
    # Check if Redis is installed
    if ! command -v redis-cli >/dev/null 2>&1; then
        error "Redis CLI is not installed"
        log "Run: ${YELLOW}sudo apt-get install redis-server${NC}"
        return 1
    fi
    
    # Test Redis connection
    if redis-cli ping >/dev/null 2>&1; then
        success "Redis server is running and responding"
        
        # Test basic operations
        log "Testing basic Redis operations..."
        local TEST_KEY="test_key_$(date +%s)"
        local TEST_VALUE="test_value"
        
        # Test SET operation
        if redis-cli set "$TEST_KEY" "$TEST_VALUE" >/dev/null; then
            success "Redis SET operation successful"
        else
            error "Redis SET operation failed"
            return 1
        fi
        
        # Test GET operation
        if [ "$(redis-cli get "$TEST_KEY")" = "$TEST_VALUE" ]; then
            success "Redis GET operation successful"
        else
            error "Redis GET operation failed"
            return 1
        fi
        
        # Clean up test key
        redis-cli del "$TEST_KEY" >/dev/null
        
        success "All Redis tests passed successfully"
        return 0
    else
        error "Redis server is not responding"
        log "Make sure Redis is running: ${YELLOW}sudo service redis-server start${NC}"
        return 1
    fi
}

# Function to test Celery
test_celery() {
    log "Testing Celery..."
    
    # Check if Celery worker is running
    if ! is_celery_running; then
        error "Celery worker is not running"
        return 1
    fi
    
    # Test Celery task
    log "Testing Celery task execution..."
    if python manage.py shell -c "
from core.tasks import test_celery_task
result = test_celery_task.delay()
try:
    output = result.get(timeout=10)
    if output == 'test_success':
        print('success')
    else:
        print('fail')
except Exception as e:
    print(f'error: {str(e)}')
" | grep -q "success"; then
        success "Celery task test passed"
    else
        error "Celery task test failed"
        return 1
    fi
    
    return 0
}

# Function to handle interactive commands
handle_command() {
    case "${1,,}" in  # Convert to lowercase
        q|quit|exit)
            cleanup
            exit 0
            ;;
        r|restart)
            restart_servers "from_interactive"
            start_interactive
            ;;
        h|health)
            check_health
            ;;
        d|django)
            test_django
            ;;
        f|firebase)
            test_firebase
            ;;
        red|RED)
            test_redis
            ;;
        c|celery)
            case "${2,,}" in
                s|status)
                    celery -A api status
                    ;;
                i|inspect)
                    case "${3,,}" in
                        a|active)
                            celery -A api inspect active
                            ;;
                        s|scheduled)
                            celery -A api inspect scheduled
                            ;;
                        *)
                            error "Unknown celery inspect command. Available commands: a/active, s/scheduled"
                            ;;
                    esac
                    ;;
                *)
                    log "Celery commands:"
                    log "  ${YELLOW}c s${NC} or ${YELLOW}celery status${NC}    - show Celery status"
                    log "  ${YELLOW}c i a${NC} or ${YELLOW}celery inspect active${NC}    - show active tasks"
                    log "  ${YELLOW}c i s${NC} or ${YELLOW}celery inspect scheduled${NC} - show scheduled tasks"
                    ;;
            esac
            ;;
        t|test)
            log "Running all tests..."
            test_django && test_firebase && test_redis && test_celery
            ;;
        det|DET)
            success "Detaching from servers. Servers will continue running in the background."
            log "Use './devs.sh' to reattach to the servers"
            exit 0
            ;;
        *)
            log "Unknown command. Here are the options:"
            log "  ${YELLOW}r/restart${NC}  - restart servers"
            log "  ${YELLOW}h/health${NC}   - check health"
            log "  ${YELLOW}d/django${NC}   - test Django"
            log "  ${YELLOW}f/firebase${NC} - test Firebase"
            log "  ${YELLOW}red/RED${NC}    - test Redis"
            log "  ${YELLOW}c/celery${NC}   - Celery commands (status, inspect)"
            log "  ${YELLOW}t/test${NC}     - run all tests"
            log "  ${YELLOW}det/DET${NC}    - detach from servers (leave them running)"
            log "  ${YELLOW}q/quit${NC}     - quit and stop servers"
            ;;
    esac
}

# Function to start interactive mode
start_interactive() {
    success "Interactive mode started. Type 'det/DET' to leave servers running in background."
    # Use read with timeout to check for both input and server status
    while true; do
        read -t 5 -r cmd
        read_status=$?
        if [ $read_status -eq 0 ]; then
            # Command was entered
            handle_command "$cmd"
        elif [ $read_status -eq 130 ]; then
            # Ctrl+C was pressed
            cleanup
            exit 0
        elif [ $read_status -eq 142 ]; then
            # SIGALRM (timeout) - just continue monitoring
            continue
        else
            # Other timeout or error occurred, check server status
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
                        error "Firebase initialization failed"
                        tail -n 10 django.log
                    elif tail -n 10 django.log | grep -q "Starting development server at"; then
                        # Still starting up
                        DJANGO_RUNNING=true
                    fi
                fi
            fi
            
            # Only report failures, don't stop servers
            if ! $VUE_RUNNING || ! $DJANGO_RUNNING; then
                if ! $VUE_RUNNING; then
                    error "Vue server stopped unexpectedly"
                    tail -n 5 vue.log
                fi
                if ! $DJANGO_RUNNING; then
                    error "Django server stopped unexpectedly"
                    tail -n 5 django.log
                fi
            fi
        fi
    done
}

# Function to check if servers are running
check_running() {
    # More thorough check for Vue process
    if pgrep -f "vue-cli-service serve" >/dev/null; then
        # Also verify it's responding
        if netstat -tlpn 2>/dev/null | grep -q ":$VUE_PORT.*LISTEN.*$(pgrep -f "vue-cli-service.*serve")/node"; then
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
    log "Checking for running servers..."
    
    # Find Vue process
    VUE_PID=$(pgrep -f "vue-cli-service.*serve" | head -n1)
    if [ -z "$VUE_PID" ]; then
        error "Vue server is not running"
        return 1
    fi
    
    # Find Django process
    DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
    if [ -z "$DJANGO_PID" ]; then
        error "Django server is not running"
        return 1
    fi
    
    # Verify servers are responding
    if ! check_running; then
        error "Servers are not responding properly"
        return 1
    fi
    
    success "Found running servers:"
    log "Vue server (PID: $VUE_PID)"
    log "Django server (PID: $DJANGO_PID)"
    
    # Start interactive mode
    start_interactive
}

# Trap Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Process command line arguments
case "${1,,}" in  # Convert to lowercase
    r|restart)
        if check_running; then
            # Get the script's directory
            SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
            cd "$SCRIPT_DIR"
            
            log "Servers are running, restarting for a fresh session..."
            restart_servers "from_cli"
            start_interactive
        else
            error "No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    h|health)
        if check_running; then
            check_health
            start_interactive
        else
            error "No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    det|DET)
        if check_running; then
            # Get the script's directory
            SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
            cd "$SCRIPT_DIR"
            
            # Find existing PIDs
            VUE_PID=$(pgrep -f "vue-cli-service.*serve" | head -n1)
            DJANGO_PID=$(pgrep -f "python.*manage.py.*runserver" | head -n1)
            
            success "Found running servers:"
            log "Vue server (PID: $VUE_PID)"
            log "Django server (PID: $DJANGO_PID)"
            
            # Start interactive mode
            start_interactive
        else
            error "No servers running. Use './devs.sh' to start servers."
            exit 1
        fi
        ;;
    help|--help|-h)
        log "Development Server Control Script"
        log ""
        log "Usage:"
        log "  ${YELLOW}./devs.sh${NC}           - Start servers and enter interactive mode"
        log "  ${YELLOW}./devs.sh det/DET${NC}   - Attach to running servers"
        log "  ${YELLOW}./devs.sh restart${NC}   - Restart running servers"
        log "  ${YELLOW}./devs.sh health${NC}    - Check servers health"
        log "  ${YELLOW}./devs.sh help${NC}      - Show this help message"
        log ""
        log "Interactive Commands:"
        log "  ${YELLOW}r/restart${NC}  - restart servers"
        log "  ${YELLOW}h/health${NC}   - check health"
        log "  ${YELLOW}d/django${NC}   - test Django"
        log "  ${YELLOW}f/firebase${NC} - test Firebase"
        log "  ${YELLOW}red/RED${NC}    - test Redis"
        log "  ${YELLOW}c/celery${NC}   - Celery commands (status, inspect)"
        log "  ${YELLOW}t/test${NC}     - run all tests"
        log "  ${YELLOW}det/DET${NC}    - detach from servers (leave them running)"
        log "  ${YELLOW}q/quit${NC}     - quit and stop servers"
        exit 0
        ;;
    *)
        # Always ensure clean slate before starting
        if check_running; then
            log "Existing servers found, restarting for a fresh session..."
            cleanup
        fi

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
        log "Checking dependencies..."
        pip install -q -r requirements.txt >/dev/null 2>&1
        success "Python dependencies installed"

        npm install --silent >/dev/null 2>&1
        success "Node.js dependencies installed"

        # Start servers and enter interactive mode
        start_servers
        start_interactive
        ;;
esac
