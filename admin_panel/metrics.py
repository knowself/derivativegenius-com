import os
import psutil
import time
from django.db import connection
from django.core.cache import cache
from django.contrib.sessions.models import Session
from firebase_admin import firestore, auth
from datetime import datetime, timedelta

class SystemMetrics:
    @staticmethod
    def get_system_metrics():
        """Get system resource metrics"""
        process = psutil.Process(os.getpid())
        
        return {
            'cpu_usage': psutil.cpu_percent(interval=1),
            'memory_usage': process.memory_info().rss / 1024 / 1024,  # MB
            'disk_usage': psutil.disk_usage('/').percent,
            'network_io': {
                'bytes_sent': psutil.net_io_counters().bytes_sent / 1024 / 1024,  # MB
                'bytes_recv': psutil.net_io_counters().bytes_recv / 1024 / 1024   # MB
            }
        }

class DjangoMetrics:
    @staticmethod
    def get_django_metrics():
        """Get Django performance metrics"""
        # Database metrics
        with connection.cursor() as cursor:
            start_time = time.time()
            cursor.execute("SELECT 1")
            db_response_time = (time.time() - start_time) * 1000  # ms

        # Cache metrics
        cache_key = 'health_check'
        cache_start = time.time()
        cache.set(cache_key, 'test', 10)
        cache.get(cache_key)
        cache_response_time = (time.time() - cache_start) * 1000  # ms

        # Session metrics
        active_sessions = Session.objects.filter(
            expire_date__gt=datetime.now()
        ).count()

        return {
            'database': {
                'query_time': db_response_time,
                'connections': len(connection.queries)
            },
            'cache': {
                'response_time': cache_response_time,
                'keys': len(cache._cache.keys()) if hasattr(cache, '_cache') else 0
            },
            'sessions': {
                'active': active_sessions
            }
        }

class FirebaseMetrics:
    @staticmethod
    def get_firebase_metrics():
        """Get Firebase performance metrics"""
        db = firestore.client()
        auth_client = auth.Client()
        
        # Measure Firestore operation time
        start_time = time.time()
        db.collection('_metrics').document('_health').set({
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        write_time = (time.time() - start_time) * 1000  # ms

        start_time = time.time()
        db.collection('_metrics').document('_health').get()
        read_time = (time.time() - start_time) * 1000  # ms

        # Get active users in last 15 minutes
        fifteen_mins_ago = datetime.now() - timedelta(minutes=15)
        active_users = 0
        try:
            users = auth_client.list_users()
            active_users = sum(1 for user in users.iterate_all() 
                             if user.user_metadata and user.user_metadata.last_sign_in_timestamp 
                             and user.user_metadata.last_sign_in_timestamp > fifteen_mins_ago.timestamp() * 1000)
        except Exception:
            pass

        return {
            'operations': {
                'read_time': read_time,
                'write_time': write_time
            },
            'users': {
                'active': active_users
            }
        }

def get_all_metrics():
    """Get all system metrics"""
    return {
        'system': SystemMetrics.get_system_metrics(),
        'django': DjangoMetrics.get_django_metrics(),
        'firebase': FirebaseMetrics.get_firebase_metrics(),
        'timestamp': datetime.now().isoformat()
    }
