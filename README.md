# Derivative Genius

A sophisticated business intelligence platform for SMBs, leveraging AI for decision-making and content production.

## Core Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│      Vue.js         │         │       Django         │         │      Firebase       │
│     Frontend        │    →    │   Business Layer     │    →    │    Data Layer      │
├─────────────────────┤    ←    ├──────────────────────┤    ←    ├─────────────────────┤
│ • User Interface    │         │ • Business Logic     │         │ • Data Storage     │
│ • State Management  │         │ • AI Orchestration   │         │ • Authentication   │
│ • API Integration   │         │ • Data Processing    │         │ • Access Control   │
│ • Form Handling     │         │ • Cache Management   │         │ • File Storage     │
│ • UI Components     │         │ • Error Handling     │         │ • Data Backup      │
└─────────────────────┘         └──────────────────────┘         └─────────────────────┘
         ↑                               ↑                                ↑
         │                               │                                │
         ▼                               ▼                                ▼
    Presentation                   Core Business                     Persistence
      Layer                           Layer                            Layer
```

### Key Responsibilities

1. **Vue.js Frontend (Presentation)**
   - User interface rendering
   - Client-side validation
   - State management
   - API consumption
   - User interaction

2. **Django Backend (Business)**
   - Business logic processing
   - AI service orchestration
   - Data transformation
   - Security middleware
   - Cache management
   - API endpoints

3. **Firebase (Data)**
   - Data persistence
   - User authentication
   - File storage
   - Access control
   - Backup management

### Data Flow

1. Client Request:
   ```
   Vue.js → Django → Firebase
   ```
   - User initiates action
   - Django processes request
   - Firebase handles data operation

2. Server Response:
   ```
   Firebase → Django → Vue.js
   ```
   - Firebase returns data
   - Django applies business logic
   - Vue.js updates UI

## Architecture Overview

This project implements a three-tier architecture optimized for business logic and AI integration:

### 1. Frontend (Vue.js)
- Single Page Application (SPA)
- Component-based UI architecture
- Business-focused dashboards and interfaces
- Asynchronous data handling
- Form validation and user input processing
- AI interaction interfaces

### 2. Business Logic Layer (Django)
- Central business logic processing
- AI service orchestration
- Data validation and transformation
- Firebase data aggregation
- Caching and optimization
- Security and access control
- API versioning and documentation

### 3. Data Layer (Firebase)
- Secure data storage
- User authentication
- Document management
- File storage
- Backup and recovery
- Access control rules

## Key Features

### Business Intelligence
- Data analysis dashboards
- Report generation
- Business metrics tracking
- Custom KPI monitoring
- Historical data analysis

### AI Integration
- Content generation
- Decision support systems
- Customer service automation
- Survey and sentiment analysis
- Predictive analytics

### Data Management
- Secure document storage
- User role management
- Audit logging
- Data export/import
- Version control

## Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Vercel      │         │     Vercel      │         │    Firebase     │
│   (Frontend)    │    →    │    (Backend)    │    →    │   Services      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ • Vue.js SPA    │         │ • Django API    │         │ • Firestore     │
│ • Static Assets │         │ • Python Runtime │         │ • Auth          │
│ • CDN           │         │ • Serverless    │         │ • Storage       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         ↑                          ↑                           ↑
         │                          │                          │
         ▼                          ▼                          ▼
    Edge Network              Serverless API              Cloud Services
```

### Vercel Deployment Benefits

1. **Frontend (Vue.js)**
   - Global Edge Network
   - Automatic HTTPS
   - Asset optimization
   - Instant cache invalidation
   - Preview deployments
   - Zero-config deployments

2. **Backend (Django)**
   - Serverless functions
   - Automatic scaling
   - Zero-config Python runtime
   - Environment variable management
   - API route handling
   - Integrated monitoring

### Deployment Configuration

1. **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/wsgi.py",
      "use": "@vercel/python"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/wsgi.py"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Deployment Process

1. **Development to Production**
```bash
# Deploy both frontend and backend
vercel deploy

# Production deployment
vercel deploy --prod
```

2. **Environment Setup**
```bash
# Configure environment variables
vercel env add FIREBASE_CONFIG
vercel env add DJANGO_SECRET_KEY
```

3. **Domain Configuration**
- Custom domain: derivativegenius.com
- Automatic SSL/TLS certificates
- Edge network distribution

### Deployment Workflow

1. **Code Push**
   ```
   Local → GitHub → Vercel → Edge Network
   ```
   - Automatic builds on push
   - Preview deployments
   - Production promotions

2. **Environment Separation**
   - Development (http://localhost:8080)
   - Preview (preview.derivativegenius.com)
   - Production (derivativegenius.com)

### Performance Optimizations

1. **Edge Network**
   - Global CDN distribution
   - Automatic caching
   - Asset compression
   - Image optimization

2. **Serverless Functions**
   - Auto-scaling
   - Cold start optimization
   - Regional deployment
   - Memory management

3. **Static Optimization**
   - Automatic minification
   - Code splitting
   - Tree shaking
   - Cache strategies

### Monitoring & Logs

1. **Vercel Dashboard**
   - Deployment status
   - Function invocations
   - Error tracking
   - Performance metrics

2. **Integration Points**
   - GitHub integration
   - Firebase console
   - Custom monitoring
   - Error reporting

## Development

### Quick Start

To start the development environment, simply run:

```bash
bash devs.sh
```

This script will:
1. Set up a Python virtual environment if it doesn't exist
2. Install all required Python dependencies
3. Install Node.js dependencies
4. Start both the Django development server and Vue.js development server in parallel
5. Set up proper cleanup on exit

### Development Servers

When you run `devs.sh`, it starts:
- Django backend server (default: http://localhost:8000)
- Vue.js development server with hot-reload (default: http://localhost:8080)

### Features of devs.sh

- **Automatic Environment Setup**: Creates and manages Python virtual environment
- **Dependency Management**: Installs both Python and Node.js dependencies
- **Parallel Server Execution**: Runs both frontend and backend servers simultaneously
- **Hot Reload**: Supports hot reload for both Django and Vue.js
- **Clean Shutdown**: Properly closes all servers when you exit (Ctrl+C)
- **Development Tools**: Includes helpful logging and error messages
- **Cross-Platform**: Works on both Unix-based systems and Windows (WSL)

### Requirements

- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

## Production Architecture

### Component Roles

1. **Vue.js Frontend**
   - Hosted on Firebase Hosting
   - Optimized static delivery
   - Client-side state management
   - User interface rendering
   - Form handling and validation

2. **Django Backend**
   - Business logic processing
   - AI service integration
   - Data aggregation and transformation
   - Cache management
   - Security middleware
   - API versioning
   - Error handling
   - Performance monitoring

3. **Firebase Services**
   - User authentication
   - Data persistence
   - File storage
   - Access control
   - Backup management

### Security Measures

1. **Frontend Security**
   - HTTPS enforcement
   - Input sanitization
   - Token management
   - XSS prevention

2. **Backend Security**
   - Request validation
   - Rate limiting
   - CORS configuration
   - Authentication middleware
   - Data encryption

3. **Data Security**
   - Firebase security rules
   - Data access logging
   - Regular security audits
   - Backup procedures

## Authentication & Authorization

### Firebase Authentication
The application uses Firebase Authentication for secure user management and access control:

1. **Authentication Flow**
   ```
   User → Firebase Auth → Django Backend
   ```
   - User credentials verified by Firebase
   - Firebase issues JWT token
   - Token validated by Django for API access

2. **Admin Access Control**
   - Admin privileges managed via Firebase Custom Claims
   - Admin claim (`admin: true`) required for admin dashboard access
   - Claims automatically synced with Django backend

3. **Token Management**
   - Firebase JWT tokens used for API authentication
   - Tokens automatically refreshed
   - Custom claims included in token payload
   - Token validation handled by Django middleware

4. **Security Features**
   - Secure token-based authentication
   - Role-based access control
   - Automatic token refresh
   - Cross-site request forgery protection
   - Session management

5. **Integration Points**
   - Frontend: Firebase Auth SDK
   - Backend: Firebase Admin SDK
   - API: JWT token validation
   - Admin Dashboard: Custom claims verification

### Setting Up Admin Access
1. Use Firebase Admin SDK to set admin claim:
   ```javascript
   admin.auth().setCustomUserClaims(uid, {admin: true});
   ```

2. Admin privileges are automatically reflected in:
   - Admin dashboard access
   - API permissions
   - UI feature availability

## Performance Optimization

1. **Frontend Performance**
   - Code splitting
   - Lazy loading
   - Asset optimization
   - Cache strategies

2. **Backend Performance**
   - Query optimization
   - Response caching
   - Background task processing
   - Load balancing

3. **Data Performance**
   - Index optimization
   - Query planning
   - Cache management
   - Connection pooling

## Scalability Considerations

- Horizontal scaling for Django
- CDN for static assets
- Cache layers for frequent queries
- Background job processing
- API rate limiting
- Resource monitoring

## AI Integration Points

1. **Content Generation**
   - Document creation
   - Report generation
   - Email composition
   - Marketing material

2. **Analysis Services**
   - Customer sentiment analysis
   - Market trend analysis
   - Performance predictions
   - Risk assessment

3. **Automation**
   - Customer service responses
   - Task prioritization
   - Decision recommendations
   - Alert generation

## Monitoring and Maintenance

1. **System Health**
   - API endpoint monitoring
   - Error tracking
   - Performance metrics
   - Resource utilization

2. **Business Metrics**
   - User engagement
   - Processing times
   - AI service usage
   - Data growth

3. **Security Monitoring**
   - Access logs
   - Authentication events
   - Error patterns
   - Security alerts

## Development Setup

### Prerequisites
- Node.js and npm for Vue.js
- Python 3.x for Django
- Firebase project credentials
- AI service API keys (as needed)

### Setup Instructions

### 1. Clone the repository
```bash
git clone [repository-url]
cd derivativegenius-com
```

### 2. Frontend Setup (Vue.js)
```bash
npm install
```

### 3. Backend Setup (Django)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
cp .env.local .env
# Edit .env with your Firebase configuration
