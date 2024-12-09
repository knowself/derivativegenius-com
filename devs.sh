#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'  # No Color
BOLD='\033[1m'

# Signal handling for clean shutdown
cleanup_and_exit() {
    echo ""
    echo "Received shutdown signal. Cleaning up..."
    stop_servers_quietly
    exit 0
}

# Clean quit without printing logs
clean_quit() {
    echo ""
    echo "Shutting down cleanly..."
    stop_servers_quietly
    echo "Cleanup complete. Exiting."
    exit 0
}

# Set up signal handlers
trap cleanup_and_exit SIGINT SIGTERM

# Create logs directory if it doesn't exist
LOGS_DIR="$(dirname "$0")/dev_logs"

# Initialize logging
setup_logging() {
    # Create logs directory if it doesn't exist
    mkdir -p "$LOGS_DIR"
    
    # Initialize log files with headers
    {
        echo "=== Development Environment Log ==="
        echo "Started at: $(date)"
        echo "==================================="
    } > "$LOGS_DIR/dev_environment.log"
    
    {
        echo "=== FastAPI Server Log ==="
        echo "Started at: $(date)"
        echo "========================="
    } > "$LOGS_DIR/fastapi.log"
    
    {
        echo "=== Vue.js Server Log ==="
        echo "Started at: $(date)"
        echo "======================="
    } > "$LOGS_DIR/vue.log"
    
    {
        echo "=== Cloud Run Emulator Log ==="
        echo "Started at: $(date)"
        echo "==========================="
    } > "$LOGS_DIR/cloud_run.log"
    
    # Set permissions to ensure logs are writable
    chmod -R 755 "$LOGS_DIR"
    
    # Create a README in the logs directory
    cat > "$LOGS_DIR/README.md" << EOF
# Development Logs

This directory contains logs from the development environment services.

## Log Files:
- `dev_environment.log`: General development environment logs
- `fastapi.log`: FastAPI server logs
- `vue.log`: Vue.js development server logs
- `cloud_run.log`: Cloud Run emulator logs

These logs are tracked in git to help with debugging and development coordination.
EOF

    debug "Logging initialized in $LOGS_DIR"
    debug "Log files are tracked in git and can be committed"
}

# Log file paths
FASTAPI_LOG="$LOGS_DIR/fastapi.log"
VUE_LOG="$LOGS_DIR/vue.log"
CLOUD_RUN_LOG="$LOGS_DIR/cloud_run.log"
PIP_BASE_LOG="$LOGS_DIR/pip_base.log"
PIP_DEV_LOG="$LOGS_DIR/pip_dev.log"
VENV_LOG="$LOGS_DIR/venv_setup.log"
DEV_ENV_LOG="$LOGS_DIR/dev_environment.log"

# Logging functions
log_section() { echo ""; echo "[SECTION] $1"; }
log_step() { echo "[STEP] $1"; }
log() { echo "[INFO] $1"; }
warn() { echo "[WARN] $1"; }
error() { 
    echo "[ERROR] $1"
    if [ -n "$2" ]; then
        echo "Details:\n$2"
    fi
}
success() { echo "[SUCCESS] $1"; }
debug() {
    if [ "${DEBUG:-false}" = "true" ]; then
        echo "[DEBUG] $1"
    fi
}

# Function to display error details from log file
show_error_context() {
    local log_file=$1
    local lines=${2:-10}
    
    if [ -f "$log_file" ]; then
        echo "Last $lines lines from $log_file:"
        echo "-------------------"
        tail -n $lines "$log_file"
        echo "-------------------"
    fi
}

# Function to check if virtual environment is active
is_venv_active() {
    if [ -n "$VIRTUAL_ENV" ]; then
        return 0
    fi
    return 1
}

# Function to ensure virtual environment is active
ensure_venv() {
    local quiet=${1:-false}
    
    if is_venv_active; then
        if [ "$quiet" != "true" ]; then
            success "Virtual environment is already active"
        fi
        return 0
    fi

    if [ "$quiet" != "true" ]; then
        log_section "Setting up Python virtual environment"
    fi

    if [ ! -d "venv" ]; then
        # Check Python version before creating venv
        if ! check_python_version; then
            return 1
        fi
        if [ "$quiet" != "true" ]; then
            log_step "Creating virtual environment..."
        fi
        python3.8 -m venv venv 2>"$VENV_LOG"
        if [ $? -ne 0 ]; then
            if [ "$quiet" != "true" ]; then
                error "Failed to create virtual environment" "$(cat "$VENV_LOG")"
            fi
            return 1
        fi
    fi
    
    if [ "$quiet" != "true" ]; then
        log_step "Activating virtual environment..."
    fi
    source venv/bin/activate
    if [ $? -ne 0 ]; then
        if [ "$quiet" != "true" ]; then
            error "Failed to activate virtual environment"
        fi
        return 1
    fi
    
    if [ "$quiet" != "true" ]; then
        log_step "Installing base dependencies..."
    fi
    pip install -r requirements.txt > "$PIP_BASE_LOG" 2>&1
    if [ $? -ne 0 ]; then
        if [ "$quiet" != "true" ]; then
            error "Failed to install base dependencies" "$(cat "$PIP_BASE_LOG")"
        fi
        return 1
    fi

    if [ "$quiet" != "true" ]; then
        log_step "Installing development dependencies..."
    fi
    pip install -r requirements-dev.txt > "$PIP_DEV_LOG" 2>&1
    if [ $? -ne 0 ]; then
        if [ "$quiet" != "true" ]; then
            error "Failed to install development dependencies" "$(show_error_context "$PIP_DEV_LOG")"
        fi
        return 1
    fi
    
    if [ "$quiet" != "true" ]; then
        success "Virtual environment is ready with all dependencies"
    fi
    return 0
}

# Function to setup virtual environment
setup_venv() {
    if [ ! -d "venv" ]; then
        log "Creating virtual environment with Python 3.8..."
        python3.8 -m venv venv
        if [ $? -ne 0 ]; then
            error "Failed to create virtual environment"
            return 1
        fi
    fi
    
    source venv/bin/activate
    if [ $? -ne 0 ]; then
        error "Failed to activate virtual environment"
        return 1
    fi
    
    log "Installing/updating dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        error "Failed to install dependencies"
        return 1
    fi
    
    success "Virtual environment is ready"
    return 0
}

# Function to check if FastAPI is running
is_fastapi_running() {
    local quiet=${1:-false}
    if pgrep -f "uvicorn.*main:app" > /dev/null; then
        return 0
    fi
    if [ "$quiet" != "true" ]; then
        error "FastAPI server is not running"
    fi
    return 1
}

# Function to check if Vue is running
is_vue_running() {
    local quiet=${1:-false}
    if pgrep -f "node.*@vue/cli-service/bin/vue-cli-service" > /dev/null || \
       curl -s --connect-timeout 1 --max-time 2 http://localhost:8080 > /dev/null 2>&1; then
        return 0
    fi
    if [ "$quiet" != "true" ]; then
        error "Vue server is not running"
    fi
    return 1
}

# Function to check if Cloud Run Emulator is running
is_cloud_run_emulator_running() {
    local quiet=${1:-false}
    if pgrep -f "cloud_run_emulator" > /dev/null || \
       curl -s --connect-timeout 1 --max-time 2 http://localhost:8085 > /dev/null 2>&1; then
        return 0
    fi
    if [ "$quiet" != "true" ]; then
        error "Cloud Run emulator is not running"
    fi
    return 1
}

# Function to check if FastAPI server is responding
check_fastapi_health() {
    local quiet=${1:-false}
    if curl -s --connect-timeout 1 --max-time 2 http://localhost:8000/health > /dev/null 2>&1; then
        return 0
    fi
    if [ "$quiet" != "true" ]; then
        error "FastAPI server is not responding"
    fi
    return 1
}

# Global variables for process tracking
declare -A SERVER_PIDS

# Function to start FastAPI server
start_fastapi() {
    log_section "Starting FastAPI Server"
    
    # Start FastAPI server
    nohup python3.8 -m uvicorn main:app --reload --port 8000 > "$FASTAPI_LOG" 2>&1 &
    local pid=$!
    
    # Wait for server to be ready
    log_step "Waiting for FastAPI server to be ready..."
    local max_attempts=30
    local attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if check_fastapi_health true; then
            success "FastAPI server started successfully"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    error "Failed to start FastAPI server" "Server did not respond after $max_attempts seconds"
    return 1
}

# Function to stop FastAPI server
stop_fastapi() {
    if [ -n "${SERVER_PIDS["fastapi"]}" ]; then
        log_step "Stopping FastAPI server (PID: ${SERVER_PIDS["fastapi"]})..."
        kill -TERM -${SERVER_PIDS["fastapi"]} 2>/dev/null  # Kill the entire process group
        sleep 1
        pkill -9 -f "uvicorn.*api.main:app" > /dev/null 2>&1  # Fallback cleanup
    fi
    unset SERVER_PIDS["fastapi"]
    rm -f "$LOGS_DIR/run/start_fastapi.sh"
}

# Function to start Vue server
start_vue() {
    log_section "Starting Vue Server"
    
    # Start Vue development server
    log_step "Starting Vue development server..."
    nohup npm run dev > "$VUE_LOG" 2>&1 &
    local pid=$!
    
    # Wait for server to be ready
    local max_attempts=30
    local attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if is_vue_running true; then
            success "Vue server started successfully"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    error "Failed to start Vue server" "Server did not respond after $max_attempts seconds"
    return 1
}

# Function to start Cloud Run emulator
start_cloud_run_emulator() {
    log_section "Starting Cloud Run Emulator"
    
    # Start Cloud Run emulator
    log_step "Starting Cloud Run Emulator..."
    nohup python3.8 -m cloud_run_emulator > "$CLOUD_RUN_LOG" 2>&1 &
    local pid=$!
    
    # Wait for emulator to be ready
    local max_attempts=30
    local attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if is_cloud_run_emulator_running true; then
            success "Cloud Run Emulator started successfully"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    error "Failed to start Cloud Run Emulator" "Emulator did not respond after $max_attempts seconds"
    return 1
}

# Function to start all servers
start_servers() {
    log_section "Starting All Servers"
    
    # Start FastAPI if not running
    if ! is_fastapi_running; then
        start_fastapi || warn "Failed to start FastAPI server"
    fi
    
    # Start Vue if not running
    if ! is_vue_running; then
        start_vue || warn "Failed to start Vue server"
    fi
    
    # Start Cloud Run if not running
    if ! is_cloud_run_emulator_running; then
        start_cloud_run_emulator || warn "Failed to start Cloud Run Emulator"
    fi
    
    success "Started available servers"
    print_service_status
}

# Function to stop all servers
stop_servers() {
    log_section "Stopping All Servers"
    
    # Kill only our specific server processes
    pkill -9 -f "uvicorn.*api.main:app" 2>/dev/null        # FastAPI
    pkill -9 -f "vue-cli-service.*serve" 2>/dev/null       # Vue
    pkill -9 -f "python.*cloud_run/worker.py" 2>/dev/null  # Cloud Run worker
    
    # Clean up PIDs
    unset SERVER_PIDS["fastapi"]
    unset SERVER_PIDS["vue"]
    unset SERVER_PIDS["cloud_run"]
    
    success "All servers stopped"
}

# Function to stop servers without output
stop_servers_quietly() {
    {
        # Kill only our specific server processes
        pkill -9 -f "uvicorn.*api.main:app" 2>/dev/null        # FastAPI
        pkill -9 -f "vue-cli-service.*serve" 2>/dev/null       # Vue
        pkill -9 -f "python.*cloud_run/worker.py" 2>/dev/null  # Cloud Run worker
        
        # Clean up PIDs
        unset SERVER_PIDS["fastapi"]
        unset SERVER_PIDS["vue"]
        unset SERVER_PIDS["cloud_run"]
    } > /dev/null 2>&1
}

# Function to print service status
print_service_status() {
    echo ""
    echo "Service Status:"
    
    # Check Python and venv status
    local python_status="✗"
    local venv_status="✗"
    if check_python_version true; then
        python_status="✓"
    fi
    if is_venv_active; then
        venv_status="✓"
    fi
    echo "${python_status} Python 3.8 | ${venv_status} Virtual Environment"
    
    # Check server statuses quietly and show formatted output
    local status="✗"
    if check_fastapi_health true; then
        status="✓"
        echo "$status FastAPI Server     - http://localhost:8000"
        echo "                    └─ API Docs: http://localhost:8000/docs"
    else
        echo "$status FastAPI Server     - Not running"
    fi
    
    status="✗"
    if is_vue_running true; then
        status="✓"
        echo "$status Vue.js Server     - http://localhost:8080"
    else
        echo "$status Vue.js Server     - Not running"
    fi
    
    status="✗"
    if is_cloud_run_emulator_running true; then
        status="✓"
        echo "$status Cloud Run Server  - http://localhost:8085"
    else
        echo "$status Cloud Run Server  - Not running"
    fi
    
    echo ""
    echo "Available Commands:"
    echo "  ./devs.sh         - Check environment and show status"
    echo "  ./devs.sh stop    - Stop all services"
    echo "  ./devs.sh restart - Restart all services"
    echo "  ./devs.sh logs    - View service logs"
    echo "  ./devs.sh q       - Stop services quietly"
    echo "  ./devs.sh help    - Show detailed help"
}

# Function to check server status
check_status() {
    log_section "Checking Server Status"
    local all_running=true
    local status_details=""
    
    # Check Python version
    if check_python_version true; then
        status_details+="✅ Python 3.8\n"
    else
        status_details+="❌ Python 3.8\n"
        all_running=false
    fi
    
    # Check virtual environment
    if is_venv_active; then
        status_details+="✅ Virtual Environment\n"
    else
        status_details+="❌ Virtual Environment\n"
        all_running=false
    fi
    
    # Check FastAPI
    if is_fastapi_running; then
        status_details+="✅ FastAPI (http://localhost:8000)\n"
    else
        status_details+="❌ FastAPI\n"
        all_running=false
    fi
    
    # Check Vue.js
    if is_vue_running; then
        status_details+="✅ Vue.js (http://localhost:8080)\n"
    else
        status_details+="❌ Vue.js\n"
        all_running=false
    fi
    
    # Check Cloud Run Emulator
    if is_cloud_run_emulator_running; then
        status_details+="✅ Cloud Run Emulator (http://localhost:8085)\n"
    else
        status_details+="❌ Cloud Run Emulator\n"
        all_running=false
    fi
    
    echo ""
    echo "Service Status:"
    echo "$status_details"
    
    if $all_running; then
        success "All services are running"
        return 0
    else
        warn "Some services are not running"
        return 1
    fi
}

# Function to view logs
view_logs() {
    log_section "Viewing Service Logs"
    
    echo ""
    echo "Select a service to view logs:"
    echo "1 - FastAPI"
    echo "2 - Vue.js"
    echo "3 - Cloud Run Emulator"
    echo "4 - Dependency Installation"
    echo "5 - All Services"
    echo "b - Back to main menu"
    
    read -r choice
    
    case "$choice" in
        1)
            if [ -f "$FASTAPI_LOG" ]; then
                echo ""
                echo "FastAPI Logs:"
                tail -n 50 "$FASTAPI_LOG"
            else
                warn "No FastAPI logs found"
            fi
            ;;
        2)
            if [ -f "$VUE_LOG" ]; then
                echo ""
                echo "Vue.js Logs:"
                tail -n 50 "$VUE_LOG"
            else
                warn "No Vue.js logs found"
            fi
            ;;
        3)
            if [ -f "$CLOUD_RUN_LOG" ]; then
                echo ""
                echo "Cloud Run Emulator Logs:"
                tail -n 50 "$CLOUD_RUN_LOG"
            else
                warn "No Cloud Run Emulator logs found"
            fi
            ;;
        4)
            echo ""
            echo "Dependency Installation Logs:"
            if [ -f "$PIP_BASE_LOG" ]; then
                echo ""
                echo "Base Dependencies:"
                tail -n 20 "$PIP_BASE_LOG"
            fi
            if [ -f "$PIP_DEV_LOG" ]; then
                echo ""
                echo "Development Dependencies:"
                tail -n 20 "$PIP_DEV_LOG"
            fi
            if [ -f "$VENV_LOG" ]; then
                echo ""
                echo "Virtual Environment Setup:"
                tail -n 20 "$VENV_LOG"
            fi
            ;;
        5)
            echo ""
            echo "All Service Logs:"
            for log in "$FASTAPI_LOG" "$VUE_LOG" "$CLOUD_RUN_LOG" "$PIP_BASE_LOG" "$PIP_DEV_LOG" "$VENV_LOG"; do
                if [ -f "$log" ]; then
                    echo ""
                    echo "=== $(basename "$log") ===="
                    tail -n 20 "$log"
                fi
            done
            ;;
        b|B)
            return
            ;;
        *)
            if [ -n "$choice" ]; then  # Only show error if a key was pressed
                echo ""
                echo "Unknown command."
            fi
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to display help menu
show_help() {
    echo ""
    echo "Available Commands:"
    echo "[Enter] - Show this help menu"
    echo "h/H    - Run health check on all services"
    echo "s      - Show service status"
    echo "r      - Restart all services"
    echo "c      - Clean Python cache"
    echo "l      - View service logs"
    echo "q      - Quit development server"
    echo ""
    echo "Active Services:"
    echo "FastAPI:          http://localhost:8000"
    echo "Vue.js:           http://localhost:8080"
    echo "Cloud Run:        http://localhost:8085"
    echo "API Docs:         http://localhost:8000/docs"
}

# Function to handle interactive mode
interactive_mode() {
    # Function to show available commands
    show_commands() {
        echo ""
        echo "Commands:"
        echo "  q - Quit cleanly"
        echo "  r - Restart all servers"
        echo "  s - Show status"
        echo "  l - Show log locations"
        echo "  p - Print all logs"
        echo "  h - Show this help"
    }

    while true; do
        echo ""
        echo "Interactive Mode"
        read -n 1 -r -p "> " cmd
        echo
        case "${cmd,,}" in  # Convert to lowercase
            q)
                clean_quit
                ;;
            r)
                stop_servers
                start_servers
                ;;
            s)
                check_status
                ;;
            l)
                view_logs
                ;;
            p)
                echo ""
                echo "=== FastAPI Log ===="
                cat "$FASTAPI_LOG"
                echo ""
                echo "=== Vue.js Log ===="
                cat "$VUE_LOG"
                echo ""
                echo "=== Cloud Run Log ===="
                cat "$CLOUD_RUN_LOG"
                echo ""
                echo "=== Dev Environment Log ===="
                cat "$DEV_ENV_LOG"
                ;;
            h)
                show_commands
                ;;
            *)
                if [ -n "$cmd" ]; then  # Only show error if a key was pressed
                    echo ""
                    echo "Unknown command."
                fi
                show_commands
                ;;
        esac
    done
}

# Function to clean Python bytecode files
clean_python_cache() {
    find . -type f -name "*.pyc" -delete
    find . -type d -name "__pycache__" -exec rm -r {} +
    find . -type f -name "*.pyo" -delete
    find . -type f -name "*.pyd" -delete
}

# Function to clean system and IDE files
clean_system_files() {
    find . -type f -name ".DS_Store" -delete
    find . -type f -name "Thumbs.db" -delete
    find . -type f -name "desktop.ini" -delete
    find . -type f -name "*.swp" -delete
    find . -type f -name "*.swo" -delete
}

# Function to cleanup processes and files
cleanup() {
    log_section "Cleaning Up"
    
    stop_servers
    clean_python_cache
    clean_system_files
    
    success "Cleanup completed"
}

# Function to display help menu
show_help() {
    echo ""
    echo "Available Commands:"
    echo "[Enter] - Show this help menu"
    echo "h/H    - Run health check on all services"
    echo "s      - Show service status"
    echo "r      - Restart all services"
    echo "c      - Clean Python cache"
    echo "l      - View service logs"
    echo "q      - Quit development server"
    echo ""
    echo "Active Services:"
    echo "FastAPI:          http://localhost:8000"
    echo "Vue.js:           http://localhost:8080"
    echo "Cloud Run:        http://localhost:8085"
    echo "API Docs:         http://localhost:8000/docs"
}

# Function to run health check
health_check() {
    log_section "Running Health Check"
    
    local all_healthy=true
    local details=""
    
    # Check Python and venv status
    local python_status="✗"
    local venv_status="✗"
    if check_python_version true; then
        python_status="✓"
    fi
    if is_venv_active; then
        venv_status="✓"
    fi
    details+="${python_status} Python 3.8 | ${venv_status} Virtual Environment\n"
    
    # Check FastAPI
    if is_fastapi_running; then
        details+="✅ FastAPI (http://localhost:8000)\n"
    else
        details+="❌ FastAPI\n"
        all_healthy=false
    fi
    
    # Check Vue.js
    if is_vue_running; then
        details+="✅ Vue.js (http://localhost:8080)\n"
    else
        details+="❌ Vue.js\n"
        all_healthy=false
    fi
    
    # Check Cloud Run Emulator
    if is_cloud_run_emulator_running; then
        details+="✅ Cloud Run Emulator (http://localhost:8085)\n"
    else
        details+="❌ Cloud Run Emulator\n"
        all_healthy=false
    fi
    
    echo ""
    echo "Health Check Results:"
    echo "$details"
    
    if $all_healthy; then
        success "All services are healthy"
        return 0
    else
        warn "Some services are unhealthy"
        return 1
    fi
}

# Function to check Python version
check_python_version() {
    local quiet=${1:-false}
    
    if ! command -v python3.8 &> /dev/null; then
        if [ "$quiet" != "true" ]; then
            error "Python 3.8 is required but not found"
        fi
        return 1
    fi

    local python_version=$(python3.8 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if [[ "$python_version" != "3.8" ]]; then
        if [ "$quiet" != "true" ]; then
            error "Python version 3.8 is required, but found $python_version"
        fi
        return 1
    fi

    if [ "$quiet" != "true" ]; then
        success "Python 3.8 is installed"
    fi
    return 0
}

# Function to check and start servers if needed
check_and_start_servers() {
    local fastapi_running=false
    local vue_running=false
    local cloudrun_running=false
    local any_server_started=false

    # Check current status of all servers quietly
    check_fastapi_health true && fastapi_running=true
    is_vue_running true && vue_running=true
    is_cloud_run_emulator_running true && cloudrun_running=true

    if [ "$fastapi_running" = "false" ] || [ "$vue_running" = "false" ] || [ "$cloudrun_running" = "false" ]; then
        log_section "Starting required services"
        
        if [ "$fastapi_running" = "false" ]; then
            log_step "Starting FastAPI server..."
            start_fastapi
            any_server_started=true
        fi
        
        if [ "$vue_running" = "false" ]; then
            log_step "Starting Vue.js server..."
            start_vue
            any_server_started=true
        fi
        
        if [ "$cloudrun_running" = "false" ]; then
            log_step "Starting Cloud Run emulator..."
            start_cloud_run_emulator
            any_server_started=true
        fi

        if [ "$any_server_started" = "true" ]; then
            # Give servers a moment to start
            sleep 2
            success "Services started"
            echo ""
        fi
    fi
}

# Main script execution
main() {
    # Set up environment variables
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    LOGS_DIR="$SCRIPT_DIR/dev_logs"
    export LOGS_DIR
    
    # Create logs directory if it doesn't exist
    mkdir -p "$LOGS_DIR"
    
    # Set up log file paths
    FASTAPI_LOG="$LOGS_DIR/fastapi.log"
    VUE_LOG="$LOGS_DIR/vue.log"
    CLOUD_RUN_LOG="$LOGS_DIR/cloud_run.log"
    DEV_ENV_LOG="$LOGS_DIR/dev_environment.log"
    
    local command=${1:-""}
    
    case "$command" in
        "stop")
            stop_servers
            ;;
        "restart")
            stop_servers
            start_servers
            ;;
        "logs")
            show_all_logs
            ;;
        "q")
            stop_servers_quietly
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            # Default behavior: ensure venv and check/start services
            #
            # IMPORTANT DESIGN DECISIONS:
            # 1. Virtual environment must be active before any server operations
            # 2. Server startup sequence:
            #    - First check and start any non-running servers
            #    - Then show final status of all services
            # 3. Port assignments (DO NOT CHANGE):
            #    - FastAPI:    8000 (API docs at /docs)
            #    - Vue.js:     8080 (dev server)
            #    - Cloud Run:  8085 (emulator)
            #
            # WARNING: Do not add a status check before server startup.
            # The current flow ensures clean startup and accurate final status.
            if ! ensure_venv; then
                error "Failed to set up Python virtual environment"
                exit 1
            fi
            check_and_start_servers
            print_service_status  # Show final status after any server changes
            ;;
    esac
}

# Call main function with all script arguments
main "$@"
