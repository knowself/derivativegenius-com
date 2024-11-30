# Derivative Genius

Derivative Genius is an AI Automation Agency (AAA) that transforms businesses through intelligent automation. We harness cutting-edge AI tools to automate workflows, streamline operations, and create scalable solutions that drive efficiency and growth.

## Our Services

- **Custom AI Automation Solutions**: Tailored automation systems designed for your specific business needs
- **Workflow Optimization & Integration**: Streamline operations with intelligent process automation
- **AI Tool Implementation & Training**: Expert implementation of cutting-edge AI tools and comprehensive training
- **Process Automation Consulting**: Strategic guidance for your automation journey

## Core Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│      Vue.js         │         │       Django         │         │     Firebase        │
│     Frontend        │    →    │      Backend         │    →    │     Services        │
├─────────────────────┤    ←    ├──────────────────────┤    ←    ├─────────────────────┤
│ • User Interface    │         │ • API Gateway        │         │ • Authentication    │
│ • State Management  │         │ • Business Logic     │         │ • Data Storage      │
│ • API Integration   │         │ • Health Checks      │         │ • Cloud Functions   │
└─────────────────────┘         └──────────────────────┘         └─────────────────────┘
                                         ↑   ↓
                               ┌──────────────────────┐
                               │    Task Queue        │
                               │  (Celery + Redis)    │
                               ├──────────────────────┤
                               │ • Async Processing   │
                               │ • Scheduled Tasks    │
                               │ • Background Jobs    │
                               └──────────────────────┘
```

## Key Features

- **Robust Authentication**: Firebase-based authentication with Django integration
- **Health Monitoring**: Comprehensive health checks for all system components (Django, Redis, Celery)
- **Task Queue System**: Celery-based asynchronous processing with Redis broker
- **Secure Communication**: CSRF protection and proper session management
- **Developer Experience**: Streamlined development workflow with automatic server detection

## Architecture Overview

Our application uses a modern, secure architecture combining Vue.js, Django, and Firebase:

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│      Vue.js         │         │       Django         │         │     Firebase        │
│     Frontend        │    →    │      Backend         │    →    │     Services        │
├─────────────────────┤    ←    ├──────────────────────┤    ←    ├─────────────────────┤
│ • User Interface    │         │ • API Gateway        │         │ • Authentication    │
│ • State Management  │         │ • Business Logic     │         │ • Data Storage      │
│ • API Integration   │         │ • Health Checks      │         │ • Cloud Functions   │
└─────────────────────┘         └──────────────────────┘         └─────────────────────┘
                                         ↑   ↓
                               ┌──────────────────────┐
                               │    Task Queue        │
                               │  (Celery + Redis)    │
                               ├──────────────────────┤
                               │ • Async Processing   │
                               │ • Scheduled Tasks    │
                               │ • Background Jobs    │
                               └──────────────────────┘
```

## Key Responsibilities

1. **Vue.js Frontend (Presentation)**
   - Automation workflow designer
   - Process monitoring dashboard
   - Task management interface
   - Real-time automation status
   - User interaction via REST API

2. **Django Backend (Application)**
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
   Vue.js → Django (Firebase Admin SDK) → Firebase Cloud
   ```
   - User initiates action via REST API
   - Django authenticates and processes request
   - Firebase Admin SDK handles cloud operations

2. Server Response Flow:
   ```
   Firebase Cloud → Django (Firebase Admin SDK) → Vue.js
   ```
   - Firebase returns data to Admin SDK
   - Django applies business logic and security
   - Vue.js updates UI based on REST response

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
- Django server status
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
# Terminal 1: Start Django development server
python3 manage.py runserver

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
- Django Debug Toolbar: `http://localhost:8000/__debug__/`
- Vue DevTools: Install browser extension
- Firebase Emulator: `http://localhost:4000`

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
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│    Vercel       │         │     Vercel       │         │    Firebase     │
│  Static Build   │    →    │   Serverless     │    →    │    Services     │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ • Vue.js App    │         │ • Django API     │         │ • Authentication│
│ • Static Assets │         │ • Admin Panel    │         │ • Firestore     │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Local Development
Local development remains unchanged and independent of deployment:
- Use `devs.sh` for local development server
- All Firebase services work locally through `.env` configuration
- Django development server runs normally

### Deployment Process
1. Vercel builds both Vue.js frontend and Django backend
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
3. Django session is established
4. CSRF token is provided for subsequent requests

## Security Features

- **CSRF Protection**: Automatic token management
- **Session Security**: Secure session handling
- **Error Recovery**: Automatic retry mechanisms
- **Health Monitoring**: Proactive system checks

## Development Guidelines

See our comprehensive development standards in `_ai_dev_principles_standards.md`

## Dependencies

### Backend
- Django 4.1.3
- Django REST Framework 3.15.2
- Firebase Admin 6.2.0
- Other dependencies in `requirements.txt`

### Frontend
- Vue.js 3.x
- Vue Router 4.x
- Pinia 2.x
- Axios
- Other dependencies in `package.json`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow our coding standards
4. Submit a pull request

## License

Proprietary - All Rights Reserved

## Support

For support, email support@derivativegenius.com
