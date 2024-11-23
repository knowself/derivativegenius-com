[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango&demo-title=Django%20%2B%20Vercel&demo-description=Use%20Django%204%20on%20Vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fdjango-template.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994241/random/django.png)

# Derivative Genius - AI Automation Agency (AAA)

## About Us

We are Derivative Genius, an AI Automation Agency (AAA). We believe that we are all standing on the shoulders of giants, living in a time when each of us can utilize all the intellectual tools ever conceived by humankind. As businesses and industries revolutionize themselves with cutting-edge AI tools and techniques, Derivative Genius is here to guide and support this transformation.

## Our Services

### AI Solutions & Implementation
- Innovative solutions harnessing the power of AI for your business
- Custom AI integration strategies tailored to your specific needs
- State-of-the-art AI tools and frameworks implementation

### Process Automation
- Automation of repetitive and time-consuming tasks
- Workflow optimization through AI-driven solutions
- Efficiency improvements in business operations

### Data Analytics & Decision Support
- Enhanced decision-making processes through data analysis
- Predictive analytics and forecasting
- Data-driven insights for business strategy

### Personalization & Machine Learning
- Creating personalized customer experiences
- Custom recommendation systems
- Building and training specialized machine learning models

### AI Education & Training
- Comprehensive AI education programs
- Professional training for businesses and individuals
- Up-skilling support to maintain competitive advantage

## Project Overview

This is the official website for Derivative Genius, built with Django and modern web technologies. The website features a responsive design, dynamic content management, and user preference handling.

### Features

- **Modern Design**: Clean, professional interface with responsive layout
- **Theme Support**: Light/dark mode with persistent user preferences
- **Dynamic Content**: Server-rendered pages with dynamic content loading
- **Contact Form**: Interactive contact form for client inquiries
- **Articles Section**: Knowledge sharing and thought leadership platform

### Technical Stack

- **Backend**: Django 4.x
- **Frontend**: Bootstrap 5.3.0
- **Database**: Google Firebase (both development and production)
  - Firestore for data storage
  - Firebase Authentication for user management
  - Firebase Hosting for deployment
- **Deployment**: Vercel with Firebase integration
- **Static Files**: Django static files with Vercel integration
- **Version Control**: Git

### Why Firebase?

Our application leverages Google Firebase's powerful suite of cloud services for several key advantages:

- **Global Scale**: Built on Google Cloud infrastructure, Firebase automatically scales with your application needs and provides low-latency data access through a global network of servers
- **Real-time Capabilities**: Firebase's real-time database and Firestore enable instant data synchronization across all connected clients
- **Enterprise-grade Security**: Benefit from Google's world-class security infrastructure, including:
  - Automatic data encryption at rest and in transit
  - Identity and access management (IAM)
  - Built-in protection against common web vulnerabilities
- **Reliability**: 99.99% uptime SLA backed by Google's infrastructure
- **Cost-effective**: Pay-as-you-go pricing model with generous free tier for development and small applications
- **Development Speed**: Comprehensive SDKs and ready-to-use features allow rapid development and deployment

### Firebase Configuration

To run this project, you'll need to:
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Set up Firebase configuration in the project
3. Enable necessary Firebase services (Firestore, Authentication)

### Project Structure

```
derivativegenius-com/
├── api/                # Django project settings
├── core/              # Main Django app
│   ├── models.py      # Database models
│   ├── views.py       # View controllers
│   ├── urls.py        # URL routing
│   └── templates/     # HTML templates
├── public/            # Public assets
├── src/
│   └── firebase/     # Firebase configuration and services
├── staticfiles/       # Collected static files
└── manage.py          # Django management script
```

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/derivativegenius-com.git
   cd derivativegenius-com
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   python manage.py migrate
   ```

4. Run the development server:
   ```bash
   python manage.py runserver
   ```

5. Visit `http://localhost:8000` in your browser

### Development Environment

#### Terminal Prompt

We include a minimal, clean terminal prompt configuration that enhances the development experience. The prompt is designed to be minimal yet informative, showing you exactly what you need to know:

```bash
dev$                  # Normal directory
(v) dev$             # In virtualenv
~$                   # Home directory
(v) myproject$       # In virtualenv, in project
```

#### Features
- Shows current directory name only (keeps prompt short)
- Indicates virtualenv status with `(v)` prefix
- Works in any terminal or VSCode
- No colors or special characters (maximum compatibility)
- Shows `~` when in home directory

#### Usage Options

1. **Project-Specific Usage**
   ```bash
   # From the project directory
   source .bash_prompt
   ```
   This is useful when you want the minimal prompt only while working in this project.

2. **Global Installation**
   ```bash
   # Add to your ~/.bashrc (recommended)
   echo 'source /full/path/to/project/.bash_prompt' >> ~/.bashrc
   source ~/.bashrc
   ```
   Or manually add to your `~/.bashrc`:
   ```bash
   # Add this line to ~/.bashrc
   source /full/path/to/project/.bash_prompt
   ```
   This gives you the minimal prompt everywhere.

3. **Temporary Global Usage**
   ```bash
   # From any directory
   source /full/path/to/project/.bash_prompt
   ```
   This sets the prompt for your current terminal session only.

#### Tips for Usage

- **Project Development**:
  ```bash
  cd /path/to/project
  source .bash_prompt
  source venv/bin/activate    # Prompt shows (v)
  ```

- **Global Development**:
  ```bash
  # After adding to ~/.bashrc
  cd ~/any/directory         # Shows directory name
  source venv/bin/activate   # Shows (v) prefix
  deactivate                # Returns to normal prompt
  ```

- **Multiple Projects**:
  The prompt works seamlessly across different projects:
  ```bash
  cd ~/project1    # Shows: project1$
  source venv/bin/activate   # Shows: (v) project1$
  cd ~/project2    # Shows: (v) project2$
  ```

#### Why This Prompt?

1. **Simplicity**
   - No dependencies or external tools required
   - Pure bash implementation
   - Works in any terminal or IDE

2. **Performance**
   - No subprocess calls or expensive operations
   - Instant prompt updates
   - No lag when changing directories

3. **Clarity**
   - Virtual environment status is immediately visible
   - Current directory is always clear
   - No visual clutter

4. **Compatibility**
   - Works across different terminals
   - Compatible with VSCode integrated terminal
   - No special fonts or characters needed

#### Customization

The prompt configuration is in `.bash_prompt`. You can customize it by:
1. Copying it to your home directory
2. Modifying the format in `set_minimal_prompt()`
3. Sourcing your modified version

Example customization:
```bash
# Copy to home directory
cp .bash_prompt ~/.my_custom_prompt

# Edit to your liking
nano ~/.my_custom_prompt

# Source your custom version
source ~/.my_custom_prompt
```

#### Nodemon Integration

We use `nodemon` to enhance the development experience by automatically restarting the Django development server when files change. This setup follows Node.js ecosystem best practices and provides several advantages:

##### Why Nodemon?

- **Automatic Reloading**: Instantly reflects code changes without manual server restarts
- **Configurable Watching**: Monitors specific file types and directories
- **Cross-Platform**: Works consistently across different operating systems
- **Reliable Process Management**: Properly handles server termination and restart

##### Configuration

Our nodemon setup is integrated through `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --watch '**/*' --ext 'py,html,css,js' --exec 'python3 manage.py runserver' --signal SIGTERM"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

Configuration breakdown:
- `--watch '**/*'`: Watches all directories and subdirectories
- `--ext 'py,html,css,js'`: Monitors changes in Python, HTML, CSS, and JavaScript files
- `--exec 'python3 manage.py runserver'`: Command to run the Django server
- `--signal SIGTERM`: Ensures clean server shutdown

##### Benefits of Our Setup

1. **Development Tool Integration**
   - Uses npm's script system for standardized tooling
   - Integrates smoothly with other development tools
   - Follows modern web development practices

2. **Dependency Management**
   - Nodemon is a local project dependency
   - Version is locked in package.json
   - No global installations required
   - Consistent environment across team members

3. **Cross-Platform Compatibility**
   - Works identically on Windows, macOS, and Linux
   - No platform-specific scripts needed
   - Reliable file watching across operating systems

4. **Developer Experience**
   - Simple `npm run dev` command to start development
   - Automatic reloading for rapid development
   - Clear feedback on file changes and server status
   - Manual restart available with `rs` command

#### Using the Development Server

1. **First-Time Setup**
   ```bash
   # Install dependencies (including nodemon)
   npm install
   ```

2. **Starting Development**
   ```bash
   # Start the development server
   npm run dev
   ```

3. **Development Controls**
   - `Ctrl+C`: Stop the development server
   - Type `rs` + Enter: Manually restart the server
   - File changes: Automatic server restart

4. **Watch Behavior**
   The server automatically restarts when these files change:
   - `*.py`: Python source files
   - `*.html`: Template files
   - `*.css`: Stylesheets
   - `*.js`: JavaScript files

#### Troubleshooting

1. **Dependencies**
   ```bash
   # Reinstall dependencies if nodemon isn't found
   npm install
   ```

2. **Port Conflicts**
   ```bash
   # Kill existing Django server processes
   pkill -f "runserver"
   ```

3. **Watch Issues**
   - Verify file extensions match the `--ext` configuration
   - Check file paths are within the watched directories
   - Try manual restart with `rs` command

4. **Performance**
   - Large number of files? Adjust watch patterns
   - Slow restarts? Check for unnecessary file watching
   - High CPU usage? Consider excluding heavy directories

#### Best Practices

1. **File Organization**
   - Keep watched files organized in appropriate directories
   - Avoid unnecessary file changes in watched paths
   - Use `.gitignore` patterns to exclude unnecessary files

2. **Development Workflow**
   - Let automatic reloading handle most changes
   - Use manual restart (`rs`) for configuration changes
   - Keep the console visible to monitor server status

3. **Team Collaboration**
   - Commit package.json changes to version control
   - Document any watch pattern changes
   - Share troubleshooting solutions with the team

### Development Commands

- Create database migrations:
  ```bash
  python manage.py makemigrations
  ```

- Apply migrations:
  ```bash
  python manage.py migrate
  ```

- Collect static files:
  ```bash
  python manage.py collectstatic
  ```

### Development Server

We use `nodemon` to automatically restart the Django development server when files change. This is configured in `package.json` for a smooth development experience.

#### Prerequisites

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

#### Starting the Development Server

Run the development server with:
```bash
npm run dev
```

#### Features

- **Auto-reload**: The server automatically restarts when you make changes to:
  - Python files (*.py)
  - HTML templates (*.html)
  - CSS files (*.css)
  - JavaScript files (*.js)

- **Controls**:
  - `Ctrl+C`: Stop the server
  - Type `rs` and press Enter: Manually restart the server

#### How It Works

The development script uses `nodemon` to:
1. Watch for file changes in your project
2. Automatically restart the Django server when files change
3. Provide manual restart capability

#### Troubleshooting

If you encounter any issues:

1. **Dependencies not found**:
   ```bash
   npm install
   ```

2. **Port already in use**:
   ```bash
   pkill -f "runserver"
   ```
   Then try starting the server again.

3. **Changes not detected**:
   - Check that your file extension is included in the watch list
   - Try manually restarting with `rs`

## Security Considerations

Our development setup includes several security measures:

1. **Credential Protection**
   - Firebase service account files are excluded from version control
   - Sensitive files are ignored by nodemon watching
   - Environment variables are used for sensitive data

2. **Nodemon Security**
   Configuration in `nodemon.json` explicitly ignores:
   - Firebase credential files (`*firebase-adminsdk*.json`)
   - Private keys and certificates (`*.pem`, `*.key`)
   - Environment files (`.env`)
   - Credential directories (`credentials/`, `secrets/`)

3. **Best Practices**
   - Never commit Firebase service account keys
   - Use environment variables for sensitive configuration
   - Keep credentials in a secure location outside the project
   - Follow the principle of least privilege

## Firebase Configuration

To set up Firebase credentials:

1. Download your Firebase service account key
2. Place it in a secure location (e.g., `credentials/` directory)
3. Add the path to your `.env` file:
   ```
   FIREBASE_ADMIN_CREDENTIALS_PATH=credentials/your-service-account.json
   ```

The `.gitignore` file ensures sensitive files are not tracked:
```
# Firebase credentials
*firebase-adminsdk*.json
firebase-credentials.json
serviceAccount.json

# Security
*.pem
*.key
credentials/
secrets/
```

## Deployment

The website is deployed on Vercel. Automatic deployments are triggered by pushes to the main branch.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Visit our website or reach out through our contact form to discuss how we can help your business leverage AI technology.

## License

 2024 Derivative Genius. All rights reserved.

## Django + Vercel

This example shows how to use Django 4 on Vercel with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## Demo

https://django-template.vercel.app/

## How it Works

Our Django application, `example` is configured as an installed application in `api/settings.py`:

```python
# api/settings.py
INSTALLED_APPS = [
    # ...
    'example',
]
```

We allow "\*.vercel.app" subdomains in `ALLOWED_HOSTS`, in addition to 127.0.0.1:

```python
# api/settings.py
ALLOWED_HOSTS = ['127.0.0.1', '.vercel.app']
```

The `wsgi` module must use a public variable named `app` to expose the WSGI application:

```python
# api/wsgi.py
app = get_wsgi_application()
```

The corresponding `WSGI_APPLICATION` setting is configured to use the `app` variable from the `api.wsgi` module:

```python
# api/settings.py
WSGI_APPLICATION = 'api.wsgi.app'
```

There is a single view which renders the current time in `example/views.py`:

```python
# example/views.py
from datetime import datetime

from django.http import HttpResponse


def index(request):
    now = datetime.now()
    html = f'''
    <html>
        <body>
            <h1>Hello from Vercel!</h1>
            <p>The current time is { now }.</p>
        </body>
    </html>
    '''
    return HttpResponse(html)
```

This view is exposed a URL through `example/urls.py`:

```python
# example/urls.py
from django.urls import path

from example.views import index


urlpatterns = [
    path('', index),
]
```

Finally, it's made accessible to the Django server inside `api/urls.py`:

```python
# api/urls.py
from django.urls import path, include

urlpatterns = [
    ...
    path('', include('example.urls')),
]
```

This example uses the Web Server Gateway Interface (WSGI) with Django to enable handling requests on Vercel with Serverless Functions.

## Running Locally

```bash
python manage.py runserver
```

Your Django application is now available at `http://localhost:8000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango&demo-title=Django%20%2B%20Vercel&demo-description=Use%20Django%204%20on%20Vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fdjango-template.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994241/random/django.png)
