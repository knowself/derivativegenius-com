# Derivative Genius Web Application - Technical Stack Documentation

All answers you provide on any question should be to answer my questions by providng alternative options which drive forward my main goal before you change anything.

We must always establish my main goal first.

The purpose of this documentation is to provide a comprehensive overview of the technical stack used in the Derivative Genius corporate application which provides visibility into all other systems.

It outlines the core technologies, dependencies, and configurations used in this app and its development processes and they should not be changed without my explicit permission.

I want those technologies to remain up-to-date, but unchanged until I wish to use another technology.

## 🚀 Core Technologies

### Frontend Framework
- **Vue.js 3.4.15**
  - Composition API
  - Script Setup syntax
  - Component naming convention: Multi-word (e.g., HomePage, LoginPage)
- **Vue Router 4.4.5**
  - HTML5 History Mode
  - Route-based code splitting
  - Role-based navigation guards
- **Pinia 2.2.6**
  - State management
  - Firebase authentication store
  - Modular store design

### Backend Framework
- **Django**
  - REST API endpoints
  - Admin interface
  - Static file serving
- **Firebase**
  - Authentication
  - Custom claims for roles
  - Token-based security

## 🛠 Build System

### Development Tools
- **Vue CLI 5.0.8**
  - Development server
  - Hot module replacement
  - Production optimization
- **Node.js & npm**
  - Node.js version: 20.x
  - npm version: 10.x
- **Python**
  - Version: 3.9 (preferred)
  - pip for package management

### Build Configuration
- **vue.config.js**
```javascript
{
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true
}
```

### Development Scripts
- `npm run dev`: Start Vue development server
- `npm run build`: Production build
- `npm run vue-build`: Vue-only build
- `npm run lint`: ESLint checks
- `./devs.sh`: Start full development environment

## 🎨 Styling & UI

### CSS Framework
- **Tailwind CSS 3.4.1**
  - JIT (Just-In-Time) compilation
  - Custom configuration
  - Utility-first approach

### PostCSS Configuration
```javascript
{
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}
```

### UI Components
- **@heroicons/vue 2.2.0**
  - SVG icons from /24/outline directory
  - Vue 3 compatible
  - Icon naming: HomeIcon, UsersIcon, ChartBarIcon, etc.
- **Chart.js 4.4.6**
  - Data visualization
  - Vue-ChartJS integration

### Component Structure
- **Views**
  - Multi-word component names
  - Composition API with script setup
  - Role-based access control
- **Admin Dashboard**
  - Sidebar navigation
  - Stats overview
  - Recent activity tracking
  - User management

## 🔒 Authentication & Security

### Firebase Configuration
Environment Variables (Vue CLI format):
```env
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_AUTH_DOMAIN=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
```

### Authentication Flow
1. Firebase client-side auth
2. Custom claims for roles
3. Token validation
4. Role-based access control

## 🔧 Development Environment

### Required Tools
- Node.js 20.x
- npm 10.x
- Python 3.9
- Git

### Development Server
- Vue CLI: Port 8080
- Django: Port 8000
- Managed by devs.sh

### ESLint Configuration
```javascript
{
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "@babel/eslint-parser"
  }
}
```

## 📦 Dependencies

### Production Dependencies
- @firebase/app: ^0.10.16
- @firebase/auth: ^1.8.1
- @heroicons/vue: ^2.2.0
- chart.js: ^4.4.6
- core-js: ^3.35.1
- pinia: ^2.2.6
- vue: ^3.4.15
- vue-chartjs: ^5.3.2
- vue-router: ^4.4.5

### Development Dependencies
- @babel/core: ^7.24.0
- @babel/eslint-parser: ^7.23.10
- @tailwindcss/aspect-ratio: ^0.4.2
- @tailwindcss/forms: ^0.5.9
- @tailwindcss/typography: ^0.5.15
- @vue/cli-plugin-babel: ^5.0.8
- @vue/cli-plugin-eslint: ^5.0.8
- @vue/cli-service: ^5.0.8
- autoprefixer: ^10.4.17
- postcss: ^8.4.35
- tailwindcss: ^3.4.1

## 🚀 Deployment

### Build Process
1. Install dependencies (Node.js & Python)
2. Build Vue.js application
3. Collect Django static files
4. Prepare Vercel deployment structure

### Vercel Configuration
- Output directory structure
- API routes configuration
- Static file serving
- SPA fallback routes

## 🔍 Important Notes

### Environment Variables
- Use `VUE_APP_` prefix (Vue CLI standard)
- Never commit .env files
- Separate development and production values

### Best Practices
1. Multi-word component names
2. Script setup syntax for Vue components
3. Type-safe props and emits
4. Proper error handling
5. Consistent code style

### Performance Considerations
1. Route-level code splitting
2. Vendor chunk optimization
3. Production source map handling
4. Asset optimization

### Security Guidelines
1. Environment variable protection
2. XSS prevention
3. CSRF protection
4. Secure authentication flow
5. Role-based access control