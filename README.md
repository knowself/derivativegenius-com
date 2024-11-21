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
- **Database**: SQLite (development) / PostgreSQL (production)
- **Deployment**: Vercel
- **Static Files**: Django static files with Vercel integration
- **Version Control**: Git

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
