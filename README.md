# Derivative Genius

Derivative Genius is an AI Automation Agency (AAA) that transforms businesses through intelligent automation. We harness cutting-edge AI tools to automate workflows, streamline operations, and create scalable solutions that drive efficiency and growth.

## Our Services

- **Custom AI Automation Solutions**: Tailored automation systems designed for your specific business needs
- **Workflow Optimization & Integration**: Streamline operations with intelligent process automation
- **AI Tool Implementation & Training**: Expert implementation of cutting-edge AI tools and comprehensive training
- **Process Automation Consulting**: Strategic guidance for your automation journey

## Core Architecture

## Architecture Overview

### Hybrid Serverless Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vue.js    │     │   Vercel    │     │  Firebase   │
│  Frontend   │ ──> │  Functions  │ ──> │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │Cloud Pub/Sub│
                    └─────┬─────┘
                          │
                    ┌─────┴─────┐
                    │Cloud Run   │
                    │LLM Workers │
                    └───────────┘
```

1. **Frontend**
   - Static Vue.js build
   - Modern SPA architecture
   - Deployed to CDN
   - Optimized for performance

2. **Backend**
   - Vercel Functions for API endpoints
     - Fast response times
     - Automatic scaling
     - Edge deployment
   - Google Cloud Run for compute-intensive tasks
     - LLM processing
     - Long-running jobs
     - Custom runtime environment

3. **Database & Backend Services**
   - Firebase for data persistence
     - Real-time capabilities
     - Built-in authentication
     - Secure data access
   - Firebase Functions v2 for serverless operations
     - Enhanced secrets management with `defineSecret`
     - Type-safe configuration
     - Function-level resource settings
     - Secure environment variable handling
     - Used for contact form and email services
     - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions and lessons learned

4. **Job Queue System**
   - Cloud Pub/Sub for LLM workloads
   - Benefits:
     - Optimized for LLM processing
     - Flexible scaling capabilities
     - Full control over long-running jobs
   - Trade-offs:
     - Additional service complexity
     - More infrastructure to manage

### Key Benefits

1. **Performance**
   - Fast API responses through Vercel's edge network
   - Efficient processing of LLM tasks on Cloud Run
   - Real-time updates via Firebase

2. **Scalability**
   - Independent scaling of each component
   - Auto-scaling based on demand
   - Cost-effective resource utilization

3. **Maintainability**
   - Clear separation of concerns
   - Independent deployment of components
   - Simplified monitoring and debugging

## Key Features

- **Robust Authentication**: Firebase-based authentication with FastAPI integration
- **Health Monitoring**: Comprehensive health checks for all system components (FastAPI, Redis, Celery)
- **Task Queue System**: Celery-based asynchronous processing with Redis broker
- **Secure Communication**: CSRF protection and proper session management
- **Developer Experience**: Streamlined development workflow with automatic server detection

## Key Responsibilities

1. **Vue.js Frontend (Presentation)**
   - Automation workflow designer
   - Process monitoring dashboard
   - Task management interface
   - Real-time automation status
   - User interaction via REST API

2. **FastAPI Backend (Application)**
   - API Gateway for all Firebase operations
   - Authentication via Firebase Admin SDK
   - Workflow orchestration
   - Task scheduling and execution
   - Process automation engine
   - Automation monitoring
   - Security enforcement

3. **Firebase Admin (Cloud)**
   - Secure cloud services access
   - Admin SDK integration
   - Data persistence
   - Access control
   - Backup management

### Data Flow

1. Client Request Flow:
   ```
   Vue.js → FastAPI (Firebase Admin SDK) → Firebase Cloud
   ```
   - User initiates action via REST API
   - FastAPI authenticates and processes request
   - Firebase Admin SDK handles cloud operations

2. Server Response Flow:
   ```
   Firebase Cloud → FastAPI (Firebase Admin SDK) → Vue.js
   ```
   - Firebase returns data to Admin SDK
   - FastAPI applies business logic and security
   - Vue.js updates UI based on REST response

## System Resilience and Fault Tolerance

### Design Principles for Handling System Failures

Our application is designed to maintain data integrity and user experience even when facing multiple system failures. Here's how we implement this resilient architecture:

1. **Data Persistence First**
   - Always save core data before triggering dependent systems
   - Example from Contact Form:
     ```javascript
     // Save contact to Firestore first
     const saveContact = async (contactData) => {
       try {
         return await db.collection('contacts').add({
           ...contactData,
           timestamp: admin.firestore.Timestamp.now(),
           status: 'pending',
           emailSent: !!transporter  // Track email capability
         });
       } catch (error) {
         logger.error('Error saving to Firestore:', error);
         throw new Error('Failed to save contact information');
       }
     };
     ```

2. **Graceful Degradation**
   - Systems should continue functioning with reduced capabilities rather than failing completely
   - Example: Contact form continues working even when email system is down:
     ```javascript
     // Email sending is attempted only after data is saved
     try {
       await sendEmails(contactData, notificationEmail, confirmationEmail);
     } catch (emailError) {
       logger.warn('Failed to send emails, but contact was saved:', emailError);
       // Continue execution - don't throw error
     }
     ```

3. **Transparent User Feedback**
   - Clearly communicate system status to users
   - Provide appropriate feedback based on available functionality
   ```javascript
   res.status(200).json({
     success: true,
     message: 'Thank you for your message! ' + 
       (transporter ? 'We will get back to you soon.' : 
       'Your message has been received, but email notifications are currently unavailable.')
   });
   ```

4. **System Status Tracking**
   - Track the status of each system component
   - Store metadata about system capabilities with each transaction
   ```javascript
   const contactRef = await db.collection('contacts').add({
     ...contactData,
     status: 'pending',
     emailSent: !!transporter,  // Track email system status
     timestamp: admin.firestore.Timestamp.now()
   });
   ```

5. **Comprehensive Logging**
   - Log all system states and failures for debugging
   - Include relevant context in error logs
   ```javascript
   logger.error('Error in contact form:', {
     error: error.message,
     stack: error.stack,
     systemState: {
       emailSystem: !!transporter,
       timestamp: new Date().toISOString()
     }
   });
   ```

### Implementation Guidelines

When implementing new features, follow these guidelines to ensure system resilience:

1. **Data Flow**
   - Always save core data to the primary database first
   - Only proceed with auxiliary operations (email, notifications) after data is secured
   - Track the status of each operation in the database

2. **Error Handling**
   - Implement proper error boundaries
   - Catch and handle errors at appropriate levels
   - Provide meaningful error messages to users
   - Log detailed error information for debugging

3. **Status Tracking**
   - Maintain status flags for all system components
   - Store operation results with timestamps
   - Enable easy auditing of system state

4. **User Communication**
   - Provide clear feedback about system status
   - Explain any reduced functionality
   - Offer alternative actions when possible

### Example: Contact Form Implementation

The contact form demonstrates these principles:

1. **Primary Operation**: Save contact data to Firestore
2. **Secondary Operation**: Send notification emails
3. **Fallback Behavior**: Continue without email if SMTP is unavailable
4. **User Feedback**: Clear messages about submission status
5. **Monitoring**: Comprehensive logging of all operations

This architecture ensures that:
- No user data is lost, even if multiple systems fail
- Users always receive appropriate feedback
- System status is tracked and logged
- Operations degrade gracefully
- Recovery paths are clear and well-documented

## Tech Stack

- **Backend Framework**: FastAPI 0.85.0
- **Python Version**: 3.8
- **Job Processing**: Google Cloud Run + Cloud Tasks
- **Authentication**: Firebase Admin SDK
- **Monitoring**: Prometheus FastAPI Instrumentator

### Key Components

1. **API Layer** (`/api`)
   - FastAPI application handling HTTP requests
   - Firebase authentication integration
   - Job submission and management endpoints
   - Health monitoring and metrics

2. **Worker Layer** (`/worker`)
   - Cloud Run service for processing long-running jobs
   - Asynchronous job execution
   - Automatic scaling based on workload
   - Callback system for job completion notifications

### Architectural Benefits

1. **Simplified Infrastructure**
   - Serverless architecture eliminates need for server management
   - No Redis or Celery infrastructure to maintain
   - Reduced operational complexity and overhead
   - Streamlined deployment process

2. **Enhanced Performance**
   - Native async/await support with FastAPI
   - Lower latency due to reduced middleware layers
   - Efficient request handling with ASGI server
   - Optimized memory usage

3. **Cost Efficiency**
   - Pay-per-use pricing with Cloud Run
   - Automatic scaling prevents over-provisioning
   - No costs for idle resources
   - Efficient resource utilization

4. **Improved Reliability**
   - Google Cloud's enterprise-grade infrastructure
   - Built-in retry mechanisms for failed jobs
   - Automatic dead-letter queues
   - Robust error handling and monitoring

5. **Developer Experience**
   - Modern async Python syntax
   - Automatic API documentation with OpenAPI
   - Type hints for better code quality
   - Simplified codebase maintenance

### Environment Setup

Required environment variables:
```bash
GOOGLE_CLOUD_PROJECT=your-project-id
CLOUD_TASKS_QUEUE=your-queue-name
CLOUD_TASKS_LOCATION=your-location
CLOUD_RUN_SERVICE_URL=your-service-url
```

### Development Workflow

1. **Local Development**
   ```bash
   # Start FastAPI server
   uvicorn api.main:app --reload --port 8000

   # Start worker locally
   functions-framework --target=process_job --port=8085
   ```

2. **Deployment**
   - API deploys to Vercel
   - Worker deploys to Google Cloud Run
   - Queue configuration in Google Cloud Tasks

### Monitoring

- Prometheus metrics available at `/metrics`
- Health check endpoint at `/health`
- Cloud Run provides built-in logging and monitoring

## Local Development

### Prerequisites
- Python 3.8 (LTS)
- Node.js 18.x LTS
- Redis Server (for Celery task queue)
- Firebase project credentials
- Git

### Initial Setup
```bash
# Clone repository
git clone [repository-url]
cd derivativegenius-com

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies (development)
pip3 install -r requirements-dev.txt

# Install Node dependencies
npm install

# Set up local environment
cp .env.example .env.local
```

### Development Workflow

1. Start all services:
```bash
./devs.sh start
```

2. Monitor system health:
```bash
./devs.sh health
```

The health check will verify:
- FastAPI server status
- Vue development server
- Redis connection
- Celery worker status
- Celery beat scheduler

3. View task queue status:
```bash
# Check Celery worker status
./devs.sh celery status

# View active tasks
./devs.sh celery inspect active

# View scheduled tasks
./devs.sh celery inspect scheduled
```

4. Stop all services:
```bash
./devs.sh stop
```

### 1. Install Redis Server
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install redis-server

# Start Redis service
sudo service redis-server start

# Verify Redis is running
redis-cli ping  # Should return PONG
```

### 2. Clone and Setup
```bash
# Clone repository
git clone [repository-url]
cd derivativegenius-com

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies (development)
pip3 install -r requirements-dev.txt

# Install Node dependencies
npm install

# Set up local environment
cp .env.example .env.local
```

### Firebase Local Setup
```bash
# Install Firebase tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Start Firebase emulators
firebase emulators:start
```

### Development Server
```bash
# Terminal 1: Start FastAPI development server
uvicorn main:app --reload

# Terminal 2: Start Vue development server
npm run serve
```

### Local Testing
```bash
# Run Python tests
python3 -m pytest

# Run Vue tests
npm run test:unit

# Run all tests with coverage
npm run test:coverage
```

### Development Tools
- FastAPI Debug: `http://localhost:8000/docs`
- Vue DevTools: Install browser extension
- Firebase Emulator: `http://localhost:4000`

## Environment Setup

### Firebase Configuration
1. Download your Firebase service account JSON file from the Firebase Console
2. Save it as `/api/firebase-credentials.json`
3. This file contains all necessary Firebase Admin SDK credentials and is excluded from version control
4. Do NOT store Firebase credentials in .env files

## Task Queue Setup

### Celery Setup
```bash
# Install requirements
pip install -r requirements.txt

# Start Celery worker
celery -A api worker -l INFO

# Start Celery beat (for scheduled tasks)
celery -A api beat -l INFO
```

### Using Celery Tasks
```python
from core.tasks import process_ai_request, send_notification

# Async AI processing
result = process_ai_request.delay({
    'model': 'gpt-4',
    'inputs': {'prompt': 'Hello, AI!'},
    'options': {'temperature': 0.7}
})

# Send notification
send_notification.delay(
    user_email='user@example.com',
    subject='Task Completed',
    message='Your AI processing is complete!'
)
```

### Monitoring Tasks
- Check task status: `result.status`
- Get task result: `result.get()`
- Monitor workers: `celery -A api status`
- View task events: `celery -A api events`

## Production Deployment

### Prerequisites
- Vercel CLI
- Firebase project
- Production environment variables

### Build Process
```bash
# Install production dependencies
pip3 install -r requirements.txt
npm install --production

# Build frontend
npm run build

# Deploy to Vercel
vercel --prod
```

### Size Limits
- Lambda Functions: 50MB max
- Total Deployment: 100MB max
- Individual Chunks: 500KB warning

### Code Splitting
```javascript
// Route-level splitting
const UserDashboard = () => import('./views/UserDashboard.vue')

// Component-level splitting
const HeavyComponent = () => import('./components/HeavyComponent.vue')
```

### Deployment Monitoring
```bash
# Check bundle size
npm run build -- --report

# Monitor production
vercel logs
```

### Production Caching
- Static Assets: 1-year cache (immutable)
- API Responses: Contextual headers
- Dynamic Routes: Custom cache rules

## System Requirements

Before starting development, ensure you have:

1. **Python 3.8**
   ```bash
   sudo apt update
   sudo apt install python3.8 python3.8-venv
   ```

2. **Google Cloud SDK**
   ```bash
   # Add Google Cloud SDK distribution URI as a package source
   echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

   # Import the Google Cloud public key
   curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

   # Update and install the SDK
   sudo apt-get update && sudo apt-get install google-cloud-sdk
   ```

3. **Node.js and npm** (for Vue.js development)
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

The `devs.sh` script will handle:
- Python virtual environment creation
- Python package installation
- Development server startup

## Dependencies Management

Our project uses a structured approach to managing Python dependencies:

```
requirements/
├── requirements-base.txt    # Base dependencies for all environments
├── requirements-dev.txt     # Development-specific dependencies
└── requirements.txt         # Production dependencies
```

### Requirements Structure

1. **Base Requirements** (`requirements-base.txt`)
   - Core dependencies needed in all environments
   - Includes:
     - FastAPI 0.85.0 (Last stable version for Python 3.8)
     - Firebase and Google Cloud packages
     - Core security packages
     - Basic monitoring tools
     - Performance utilities

2. **Development Requirements** (`requirements-dev.txt`)
   - Extends base requirements (`-r requirements-base.txt`)
   - Development and testing tools:
     - Testing: pytest, pytest-asyncio, coverage
     - Code Quality: black, flake8, mypy, pylint
     - Type Checking: types-python-jose, types-passlib
     - FastAPI development extras
     - Auto-reloading capabilities

3. **Production Requirements** (`requirements.txt`)
   - Extends base requirements (`-r requirements-base.txt`)
   - Production-specific tools:
     - WSGI/ASGI servers: gunicorn, uvicorn[standard]
     - Monitoring: psutil, prometheus-client
     - Error tracking: sentry-sdk
     - Performance optimizations: orjson, ujson
     - Additional security features

### Version Control

- Python version: 3.8 (LTS)
- FastAPI version: 0.85.0 (Last stable version fully supporting Python 3.8)
- All dependencies are pinned to specific versions for reproducibility

### Local Development

The `devs.sh` script automatically:
1. Creates a Python 3.8 virtual environment
2. Installs base dependencies
3. Adds development tools and testing packages

To manually install dependencies:
```bash
# Create and activate virtual environment
python3.8 -m venv venv
source venv/bin/activate

# Install all dependencies (including development)
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## Environment Variables

### Local Development
Required in `.env.local`:
```plaintext
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
DJANGO_SECRET_KEY=xxx
DEBUG=True
```

### Production (Vercel)
Required in Vercel dashboard:
```plaintext
FIREBASE_ADMIN_CREDENTIALS=xxx
DJANGO_SECRET_KEY=xxx
FIREBASE_PROJECT_ID=xxx
DEBUG=False
```

## Testing

### Local Tests
```bash
# Full test suite
npm run test:all

# Individual components
python3 -m pytest tests/api/
npm run test:unit components/
```

### Production Tests
```bash
# Health checks
curl https://[your-domain]/health/

# Smoke tests
npm run test:e2e:prod
```

## Deployment Architecture

Our application uses a hybrid deployment strategy on Vercel:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vue.js    │     │   Vercel    │     │  Firebase   │
│  Frontend   │ ──> │  Functions  │ ──> │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │Cloud Pub/Sub│
                    └─────┬─────┘
                          │
                    ┌─────┴─────┐
                    │Cloud Run   │
                    │LLM Workers │
                    └───────────┘
```

### Local Development
Local development remains unchanged and independent of deployment:
- Use `devs.sh` for local development server
- All Firebase services work locally through `.env` configuration
- FastAPI development server runs normally

### Deployment Process
1. Vercel builds both Vue.js frontend and FastAPI backend
2. Frontend is served as static files
3. Backend runs as serverless functions
4. Firebase integration works identically in both environments

### Firebase Integration
Firebase services are available in both local and deployed environments:
- Authentication flows remain consistent
- Firestore access is maintained
- Admin SDK configuration is preserved
- Environment variables are properly handled

## API Documentation

### Health Check Endpoints

- `/health/`: General system health status
- `/vue-status/`: Vue.js server status
- Both endpoints return CSRF tokens and don't require authentication

### Authentication Flow

1. Client initiates authentication via Firebase
2. Server validates Firebase token
3. FastAPI session is established
4. CSRF token is provided for subsequent requests

## Security Features

- **CSRF Protection**: Automatic token management
- **Session Security**: Secure session handling
- **Error Recovery**: Automatic retry mechanisms
- **Health Monitoring**: Proactive system checks

## Development Guidelines

See our comprehensive development standards in `_ai_dev_principles_standards.md`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow our coding standards
4. Submit a pull request

## License

Proprietary - All Rights Reserved

## Support

For support, email support@derivativegenius.com
