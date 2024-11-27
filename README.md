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
```

## Key Features

- **Robust Authentication**: Firebase-based authentication with Django integration
- **Health Monitoring**: Dedicated health check endpoints for system monitoring
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

## Development Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm 8+
- Firebase CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/derivativegenius-com.git
cd derivativegenius-com
```

2. Install Python dependencies:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development Server

Use our custom development script:
```bash
./devs.sh
```

This script:
- Starts Django development server
- Launches Vue development server
- Monitors server health
- Provides automatic error recovery

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
