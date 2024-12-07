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
    echo -e "\n${YELLOW}Received shutdown signal. Cleaning up...${NC}"
    stop_servers
    
    # Print all logs with clean headers
    echo -e "\n${BOLD}${BLUE}=== FastAPI Log ===${NC}"
    cat "$FASTAPI_LOG"
    
    echo -e "\n${BOLD}${BLUE}=== Vue.js Log ===${NC}"
    grep -v "=== vue Log ===" "$VUE_LOG"
    
    echo -e "\n${BOLD}${BLUE}=== Cloud Run Log ===${NC}"
    grep -v "=== cloud_run Log ===" "$CLOUD_RUN_LOG"
    
    echo -e "\n${BOLD}${BLUE}=== Dev Environment Log ===${NC}"
    grep -v "=== dev_environment Log ===" "$DEV_ENV_LOG"
    
    echo -e "\n${GREEN}Cleanup complete. Exiting.${NC}"
    exit 0
}

# Clean quit without printing logs
clean_quit() {
    echo -e "\n${YELLOW}Shutting down cleanly...${NC}"
    stop_servers
    echo -e "${GREEN}Cleanup complete. Exiting.${NC}"
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
log_section() { echo -e "\n${BOLD}${BLUE}[SECTION] $1${NC}\n"; }
log_step() { echo -e "${CYAN}[STEP]${NC} $1"; }
log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { 
    echo -e "${RED}[ERROR]${NC} $1"
    if [ -n "$2" ]; then
        echo -e "${RED}Details:${NC}\n$2"
    fi
}
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
debug() {
    if [ "${DEBUG:-false}" = "true" ]; then
        echo -e "${MAGENTA}[DEBUG]${NC} $1"
    fi
}

# Function to display error details from log file
show_error_context() {
    local log_file=$1
    local lines=${2:-10}
    
    if [ -f "$log_file" ]; then
        echo -e "${RED}Last $lines lines from $log_file:${NC}"
        echo -e "${YELLOW}-------------------${NC}"
        tail -n $lines "$log_file"
        echo -e "${YELLOW}-------------------${NC}"
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
    log_section "Setting up Python virtual environment"
    
    if is_venv_active; then
        success "Virtual environment is already active"
        return 0
    fi

    if [ ! -d "venv" ]; then
        # Check Python version before creating venv
        if ! check_python_version; then
            return 1
        fi
        log_step "Creating virtual environment with Python 3.8..."
        python3.8 -m venv venv 2>"$VENV_LOG"
        if [ $? -ne 0 ]; then
            error "Failed to create virtual environment" "$(cat "$VENV_LOG")"
            return 1
        fi
    fi
    
    log_step "Activating virtual environment..."
    source venv/bin/activate
    if [ $? -ne 0 ]; then
        error "Failed to activate virtual environment"
        return 1
    fi
    
    log_step "Installing base dependencies..."
    pip install -r requirements.txt > "$PIP_BASE_LOG" 2>&1
    if [ $? -ne 0 ]; then
        error "Failed to install base dependencies" "$(cat "$PIP_BASE_LOG")"
        return 1
    fi

    log_step "Installing development dependencies..."
    pip install -r requirements-dev.txt > "$PIP_DEV_LOG" 2>&1
    if [ $? -ne 0 ]; then
        error "Failed to install development dependencies" "$(show_error_context "$PIP_DEV_LOG")"
        return 1
    fi
    
    success "Virtual environment is ready with all dependencies"
    return 0
}

# Function to check Python version
check_python_version() {
    log_step "Checking Python version..."
    local required_version="3.8"
    local current_version=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
    
    debug "Current Python version: $current_version"
    debug "Required Python version: $required_version"
    
    if [ "$current_version" != "$required_version" ]; then
        error "Incorrect Python version" "Required: $required_version\nFound: $current_version\n\nTo fix:\n1. sudo apt update\n2. sudo apt install python$required_version python$required_version-venv\n3. sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python$required_version 1"
        return 1
    fi
    success "Python $required_version is installed"
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
    if curl -s http://localhost:8000/health > /dev/null; then
        return 0
    fi
    return 1
}

# Function to check if Vue is running
is_vue_running() {
    if curl -s http://localhost:8080 > /dev/null; then
        return 0
    fi
    return 1
}

# Function to check if Cloud Run Emulator is running
is_cloud_run_emulator_running() {
    if curl -s http://localhost:8085/health > /dev/null; then
        return 0
    fi
    return 1
}

# Function to check if FastAPI server is responding
check_fastapi_health() {
    local max_attempts=$1
    local attempt=1
    local delay=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            return 0
        fi
        debug "FastAPI health check attempt $attempt of $max_attempts (waiting ${delay}s)"
        sleep $delay
        attempt=$((attempt + 1))
        # Increase delay up to 3 seconds
        if [ $delay -lt 3 ]; then
            delay=$((delay + 1))
        fi
    done
    return 1
}

# Global variables for process tracking
declare -A SERVER_PIDS

# Function to start FastAPI server
start_fastapi() {
    log_section "Starting FastAPI Server"
    
    if is_fastapi_running; then
        warn "FastAPI server is already running"
        return 0
    fi

    # Ensure virtual environment is active
    if ! ensure_venv; then
        error "Failed to ensure virtual environment"
        return 1
    fi
    
    # Create run directory if it doesn't exist
    local run_dir="$LOGS_DIR/run"
    mkdir -p "$run_dir"
    
    # Kill any existing uvicorn processes
    pkill -f "uvicorn.*main:app" > /dev/null 2>&1
    sleep 1
    
    # Create a wrapper script that handles signals
    cat > "$run_dir/start_fastapi.sh" << 'EOF'
#!/bin/bash
trap '' SIGINT SIGTERM SIGTSTP  # Ignore signals
exec "$@"  # Execute the command passed to this script
EOF
    chmod +x "$run_dir/start_fastapi.sh"
    
    # Start FastAPI in its own process group with signal handling
    (trap '' SIGINT SIGTERM SIGTSTP && \
     cd "$(pwd)" && \
     setsid "$run_dir/start_fastapi.sh" "${VIRTUAL_ENV}/bin/python" -m uvicorn main:app \
        --reload \
        --host 0.0.0.0 \
        --port 8000 \
        --log-level debug \
        >> "$LOGS_DIR/fastapi.log" 2>&1 &)
    
    # Store the PID
    SERVER_PIDS["fastapi"]=$!
    
    # Give FastAPI time to start
    local max_attempts=30
    log_step "Waiting for FastAPI server to be ready..."
    
    if check_fastapi_health $max_attempts; then
        success "FastAPI server started successfully"
        debug "Process ID: ${SERVER_PIDS["fastapi"]}"
        debug "Port: 8000"
        debug "API docs available at: http://localhost:8000/docs"
        return 0
    else
        error "FastAPI server failed to start" "$(show_error_context "$LOGS_DIR/fastapi.log")"
        if [ -f "$LOGS_DIR/fastapi.log" ]; then
            error "Last 20 lines of FastAPI log:" "$(tail -n 20 "$LOGS_DIR/fastapi.log")"
        fi
        
        # Cleanup
        if kill -0 ${SERVER_PIDS["fastapi"]} 2>/dev/null; then
            kill -TERM -${SERVER_PIDS["fastapi"]} 2>/dev/null  # Kill the entire process group
        fi
        unset SERVER_PIDS["fastapi"]
        rm -f "$run_dir/start_fastapi.sh"
        return 1
    fi
}

# Function to stop FastAPI server
stop_fastapi() {
    if [ -n "${SERVER_PIDS["fastapi"]}" ]; then
        log_step "Stopping FastAPI server (PID: ${SERVER_PIDS["fastapi"]})..."
        kill -TERM -${SERVER_PIDS["fastapi"]} 2>/dev/null  # Kill the entire process group
        sleep 1
        pkill -f "uvicorn.*main:app" > /dev/null 2>&1  # Fallback cleanup
    fi
    unset SERVER_PIDS["fastapi"]
    rm -f "$LOGS_DIR/run/start_fastapi.sh"
}

# Function to start Vue server
start_vue() {
    log_section "Starting Vue Server"
    
    if is_vue_running; then
        warn "Vue server is already running"
        return 0
    fi

    log_step "Starting Vue development server..."
    npm run dev > "$VUE_LOG" 2>&1 &
    SERVER_PIDS["vue"]=$!
    
    # Give it time to start
    local start_time=$(date +%s)
    while true; do
        sleep 1
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if ! kill -0 ${SERVER_PIDS["vue"]} 2>/dev/null; then
            error "Vue server process terminated unexpectedly" "$(show_error_context "$VUE_LOG")"
            return 1
        fi
        
        if is_vue_running; then
            success "Vue server started successfully"
            debug "Process ID: ${SERVER_PIDS["vue"]}"
            debug "Port: 8080"
            return 0
        elif [ $elapsed -gt 30 ]; then
            error "Vue server took too long to initialize" "$(show_error_context "$VUE_LOG")"
            return 1
        fi
    done
}

# Function to start Cloud Run Emulator
start_cloud_run_emulator() {
    log_section "Starting Cloud Run Emulator"
    
    if is_cloud_run_emulator_running; then
        warn "Cloud Run Emulator is already running"
        return 0
    fi

    if ! ensure_venv; then
        return 1
    fi

    log_step "Starting Cloud Run Emulator..."
    
    # Check if worker/main.py exists
    if [ ! -f "worker/main.py" ]; then
        error "Cloud Run Emulator failed to start" "worker/main.py not found"
        return 1
    fi
    
    # Start the worker with functions-framework
    (cd worker && \
     PYTHONPATH=. \
     functions-framework --target=process_job --debug --port=8085 > "$CLOUD_RUN_LOG" 2>&1 &)
    
    SERVER_PIDS["cloud_run"]=$!
    
    # Give it time to start
    local start_time=$(date +%s)
    while true; do
        sleep 1
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if ! kill -0 ${SERVER_PIDS["cloud_run"]} 2>/dev/null; then
            error "Cloud Run Emulator process terminated unexpectedly" "$(show_error_context "$CLOUD_RUN_LOG")"
            return 1
        fi
        
        if is_cloud_run_emulator_running; then
            success "Cloud Run Emulator started successfully"
            debug "Process ID: ${SERVER_PIDS["cloud_run"]}"
            debug "Port: 8085"
            return 0
        elif [ $elapsed -gt 10 ]; then
            error "Cloud Run Emulator took too long to initialize" "$(show_error_context "$CLOUD_RUN_LOG")"
            return 1
        fi
    done
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
    
    # Kill FastAPI server and its tmux session
    if [ -n "${SERVER_PIDS["fastapi"]}" ]; then
        tmux kill-session -t fastapi 2>/dev/null
        pkill -f "uvicorn.*main:app" > /dev/null 2>&1
        success "FastAPI server stopped"
        unset SERVER_PIDS["fastapi"]
    fi
    
    # Kill Vue server
    if [ -n "${SERVER_PIDS["vue"]}" ] && kill -0 ${SERVER_PIDS["vue"]} 2>/dev/null; then
        kill ${SERVER_PIDS["vue"]} 2>/dev/null
        success "Vue server stopped"
        unset SERVER_PIDS["vue"]
    fi
    
    # Kill Cloud Run Emulator
    if [ -n "${SERVER_PIDS["cloud_run"]}" ] && kill -0 ${SERVER_PIDS["cloud_run"]} 2>/dev/null; then
        kill ${SERVER_PIDS["cloud_run"]} 2>/dev/null
        success "Cloud Run Emulator stopped"
        unset SERVER_PIDS["cloud_run"]
    fi
    
    # Cleanup any remaining processes
    pkill -f "uvicorn.*main:app" > /dev/null 2>&1
    pkill -f "vue-cli-service.*serve" > /dev/null 2>&1
    pkill -f "python3.*worker.py" > /dev/null 2>&1
    
    # Deactivate virtual environment if active
    if [ -n "$VIRTUAL_ENV" ]; then
        deactivate 2>/dev/null || true
    fi
}

# Function to print service status
print_service_status() {
    echo -e "\n${BOLD}${BLUE}Service Status:${NC}"
    
    # Check FastAPI
    if is_fastapi_running; then
        echo -e "${GREEN}✓${NC} FastAPI Server     - ${CYAN}http://localhost:8000${NC}"
        echo -e "                    └─ API Docs: ${CYAN}http://localhost:8000/docs${NC}"
    else
        echo -e "${RED}✗${NC} FastAPI Server     - Not running"
    fi
    
    # Check Vue.js
    if is_vue_running; then
        echo -e "${GREEN}✓${NC} Vue.js Server     - ${CYAN}http://localhost:8080${NC}"
    else
        echo -e "${RED}✗${NC} Vue.js Server     - Not running"
    fi
    
    # Check Cloud Run
    if is_cloud_run_emulator_running; then
        echo -e "${GREEN}✓${NC} Cloud Run Server  - ${CYAN}http://localhost:8085${NC}"
    else
        echo -e "${RED}✗${NC} Cloud Run Server  - Not running"
    fi
    
    echo -e "\n${BOLD}${BLUE}Available Commands:${NC}"
    echo -e "  ${CYAN}./devs.sh${NC}         - Show service status"
    echo -e "  ${CYAN}./devs.sh start${NC}   - Start all services"
    echo -e "  ${CYAN}./devs.sh stop${NC}    - Stop all services"
    echo -e "  ${CYAN}./devs.sh restart${NC} - Restart all services"
    echo -e "  ${CYAN}./devs.sh logs${NC}    - View service logs"
    echo -e "  ${CYAN}./devs.sh q${NC}       - Quit quietly"
}

# Function to check server status
check_status() {
    log_section "Checking Server Status"
    local all_running=true
    local status_details=""
    
    # Check Python version
    if check_python_version; then
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
    
    echo -e "\n${BOLD}Service Status:${NC}\n$status_details"
    
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
    
    echo -e "\n${BOLD}${BLUE}Select a service to view logs:${NC}"
    echo -e "${CYAN}1${NC} - FastAPI"
    echo -e "${CYAN}2${NC} - Vue.js"
    echo -e "${CYAN}3${NC} - Cloud Run Emulator"
    echo -e "${CYAN}4${NC} - Dependency Installation"
    echo -e "${CYAN}5${NC} - All Services"
    echo -e "${CYAN}b${NC} - Back to main menu"
    
    read -r choice
    
    case "$choice" in
        1)
            if [ -f "$FASTAPI_LOG" ]; then
                echo -e "\n${BOLD}${BLUE}FastAPI Logs:${NC}"
                tail -n 50 "$FASTAPI_LOG"
            else
                warn "No FastAPI logs found"
            fi
            ;;
        2)
            if [ -f "$VUE_LOG" ]; then
                echo -e "\n${BOLD}${BLUE}Vue.js Logs:${NC}"
                tail -n 50 "$VUE_LOG"
            else
                warn "No Vue.js logs found"
            fi
            ;;
        3)
            if [ -f "$CLOUD_RUN_LOG" ]; then
                echo -e "\n${BOLD}${BLUE}Cloud Run Emulator Logs:${NC}"
                tail -n 50 "$CLOUD_RUN_LOG"
            else
                warn "No Cloud Run Emulator logs found"
            fi
            ;;
        4)
            echo -e "\n${BOLD}${BLUE}Dependency Installation Logs:${NC}"
            if [ -f "$PIP_BASE_LOG" ]; then
                echo -e "\n${CYAN}Base Dependencies:${NC}"
                tail -n 20 "$PIP_BASE_LOG"
            fi
            if [ -f "$PIP_DEV_LOG" ]; then
                echo -e "\n${CYAN}Development Dependencies:${NC}"
                tail -n 20 "$PIP_DEV_LOG"
            fi
            if [ -f "$VENV_LOG" ]; then
                echo -e "\n${CYAN}Virtual Environment Setup:${NC}"
                tail -n 20 "$VENV_LOG"
            fi
            ;;
        5)
            echo -e "\n${BOLD}${BLUE}All Service Logs:${NC}"
            for log in "$FASTAPI_LOG" "$VUE_LOG" "$CLOUD_RUN_LOG" "$PIP_BASE_LOG" "$PIP_DEV_LOG" "$VENV_LOG"; do
                if [ -f "$log" ]; then
                    echo -e "\n${CYAN}=== $(basename "$log") ====${NC}"
                    tail -n 20 "$log"
                fi
            done
            ;;
        b|B)
            return
            ;;
        *)
            warn "Invalid choice"
            ;;
    esac
    
    echo -e "\nPress Enter to continue..."
    read -r
}

# Function to display help menu
show_help() {
    echo -e "\n${BOLD}${BLUE}Available Commands:${NC}"
    echo -e "${CYAN}[Enter]${NC} - Show this help menu"
    echo -e "${CYAN}h/H${NC}    - Run health check on all services"
    echo -e "${CYAN}s${NC}      - Show service status"
    echo -e "${CYAN}r${NC}      - Restart all services"
    echo -e "${CYAN}c${NC}      - Clean Python cache"
    echo -e "${CYAN}l${NC}      - View service logs"
    echo -e "${CYAN}q${NC}      - Quit development server"
    echo -e "\n${BOLD}${BLUE}Active Services:${NC}"
    echo -e "FastAPI:          ${CYAN}http://localhost:8000${NC}"
    echo -e "Vue.js:           ${CYAN}http://localhost:8080${NC}"
    echo -e "Cloud Run:        ${CYAN}http://localhost:8085${NC}"
    echo -e "API Docs:         ${CYAN}http://localhost:8000/docs${NC}"
}

# Function to handle interactive mode
interactive_mode() {
    # Function to show available commands
    show_commands() {
        echo -e "\n${BOLD}Commands:${NC}"
        echo -e "  ${CYAN}q${NC} - Quit cleanly"
        echo -e "  ${CYAN}r${NC} - Restart all servers"
        echo -e "  ${CYAN}s${NC} - Show status"
        echo -e "  ${CYAN}l${NC} - Show log locations"
        echo -e "  ${CYAN}p${NC} - Print all logs"
        echo -e "  ${CYAN}h${NC} - Show this help"
    }

    while true; do
        echo -e "\n${BOLD}${BLUE}Interactive Mode${NC}"
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
                echo -e "\n${BOLD}${BLUE}=== FastAPI Log ===${NC}"
                cat "$FASTAPI_LOG"
                echo -e "\n${BOLD}${BLUE}=== Vue.js Log ===${NC}"
                cat "$VUE_LOG"
                echo -e "\n${BOLD}${BLUE}=== Cloud Run Log ===${NC}"
                cat "$CLOUD_RUN_LOG"
                echo -e "\n${BOLD}${BLUE}=== Dev Environment Log ===${NC}"
                cat "$DEV_ENV_LOG"
                ;;
            h)
                show_commands
                ;;
            *)
                if [ -n "$cmd" ]; then  # Only show error if a key was pressed
                    echo -e "${RED}Unknown command.${NC}"
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
    echo -e "\n${BOLD}${BLUE}Available Commands:${NC}"
    echo -e "${CYAN}[Enter]${NC} - Show this help menu"
    echo -e "${CYAN}h/H${NC}    - Run health check on all services"
    echo -e "${CYAN}s${NC}      - Show service status"
    echo -e "${CYAN}r${NC}      - Restart all services"
    echo -e "${CYAN}c${NC}      - Clean Python cache"
    echo -e "${CYAN}l${NC}      - View service logs"
    echo -e "${CYAN}q${NC}      - Quit development server"
    echo -e "\n${BOLD}${BLUE}Active Services:${NC}"
    echo -e "FastAPI:          ${CYAN}http://localhost:8000${NC}"
    echo -e "Vue.js:           ${CYAN}http://localhost:8080${NC}"
    echo -e "Cloud Run:        ${CYAN}http://localhost:8085${NC}"
    echo -e "API Docs:         ${CYAN}http://localhost:8000/docs${NC}"
}

# Function to run health check
health_check() {
    log_section "Running Health Check"
    
    local all_healthy=true
    local details=""
    
    # Check FastAPI health
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        details+="✅ FastAPI is responding\n"
    else
        details+="❌ FastAPI is not responding\n"
        all_healthy=false
    fi
    
    # Check Vue.js
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        details+="✅ Vue.js is responding\n"
    else
        details+="❌ Vue.js is not responding\n"
        all_healthy=false
    fi
    
    # Check Cloud Run Emulator
    if curl -s http://localhost:8085/health > /dev/null 2>&1; then
        details+="✅ Cloud Run Emulator is responding\n"
    else
        details+="❌ Cloud Run Emulator is not responding\n"
        all_healthy=false
    fi
    
    # Check Python environment
    if is_venv_active; then
        details+="✅ Virtual Environment is active\n"
    else
        details+="❌ Virtual Environment is not active\n"
        all_healthy=false
    fi
    
    echo -e "\n${BOLD}Health Check Results:${NC}\n$details"
    
    if $all_healthy; then
        success "All services are healthy"
        return 0
    else
        warn "Some services are unhealthy"
        return 1
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
    
    # Ensure logs directory is properly ignored by git
    if ! grep -q "^dev_logs/$" "$SCRIPT_DIR/.gitignore" 2>/dev/null; then
        debug "Adding dev_logs/ to .gitignore"
        echo "dev_logs/" >> "$SCRIPT_DIR/.gitignore"
    fi
    
    # Set up log file paths
    FASTAPI_LOG="$LOGS_DIR/fastapi.log"
    VUE_LOG="$LOGS_DIR/vue.log"
    CLOUD_RUN_LOG="$LOGS_DIR/cloud_run.log"
    DEV_ENV_LOG="$LOGS_DIR/dev_environment.log"
    
    # Initialize or rotate logs if they get too large (>10MB)
    for log_file in "$FASTAPI_LOG" "$VUE_LOG" "$CLOUD_RUN_LOG" "$DEV_ENV_LOG"; do
        if [ -f "$log_file" ] && [ "$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file")" -gt 10485760 ]; then
            mv "$log_file" "${log_file}.old"
        fi
        touch "$log_file"
    done
    
    # Add headers to empty log files
    for log_file in "$FASTAPI_LOG" "$VUE_LOG" "$CLOUD_RUN_LOG" "$DEV_ENV_LOG"; do
        if [ ! -s "$log_file" ]; then
            {
                echo "=== $(basename "${log_file%.*}") Log ==="
                echo "Started at: $(date)"
                echo "==============================="
            } > "$log_file"
        fi
    done
    
    # Default command is 'start' if no command provided
    local command=${1:-status}
    
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
        "start")
            start_servers
            ;;
        "status"|"")  # Both empty and "status" will show status
            print_service_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# If script is being sourced, don't run main
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
