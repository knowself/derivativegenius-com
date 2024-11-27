#!/usr/bin/env python3
import os
import sys
import psutil
import json
from datetime import datetime, timedelta

def get_process_info(process_name):
    """Get detailed info about processes matching the name"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent', 'create_time']):
        try:
            cmdline = ' '.join(proc.info['cmdline'] or []).lower()
            if process_name.lower() in cmdline and 'python' in cmdline:  # Only match Python processes for Django
                # Get process info
                uptime = datetime.now().timestamp() - proc.info['create_time']
                info = {
                    'pid': proc.info['pid'],
                    'cpu_percent': round(proc.cpu_percent(interval=0.1), 1),
                    'memory_percent': round(proc.memory_percent(), 2),
                    'uptime': format_uptime(uptime),
                    'command': ' '.join(proc.info['cmdline'] or [])
                }
                processes.append(info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return processes

def get_system_metrics():
    """Get overall system metrics"""
    return {
        'cpu': {
            'percent': round(psutil.cpu_percent(interval=1), 1),
            'count': psutil.cpu_count(),
            'freq': round(psutil.cpu_freq().current if psutil.cpu_freq() else 0, 2)
        },
        'memory': {
            'total': round(psutil.virtual_memory().total / (1024 * 1024 * 1024), 2),  # GB
            'available': round(psutil.virtual_memory().available / (1024 * 1024 * 1024), 2),  # GB
            'percent': round(psutil.virtual_memory().percent, 1)
        },
        'disk': {
            'total': round(psutil.disk_usage('/').total / (1024 * 1024 * 1024), 2),  # GB
            'free': round(psutil.disk_usage('/').free / (1024 * 1024 * 1024), 2),  # GB
            'percent': round(psutil.disk_usage('/').percent, 1)
        },
        'network': {
            'bytes_sent': round(psutil.net_io_counters().bytes_sent / (1024 * 1024), 2),  # MB
            'bytes_recv': round(psutil.net_io_counters().bytes_recv / (1024 * 1024), 2)  # MB
        }
    }

def format_uptime(seconds):
    """Format uptime in a human-readable format"""
    delta = timedelta(seconds=int(seconds))
    days = delta.days
    hours, remainder = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days}d")
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")
    parts.append(f"{seconds}s")
    
    return " ".join(parts)

def main():
    # Get process info
    django_processes = get_process_info('runserver')
    vue_processes = []
    
    # Check for Vue CLI process
    for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent', 'create_time']):
        try:
            cmdline = ' '.join(proc.info['cmdline'] or []).lower()
            if ('vue-cli-service' in cmdline or 'webpack' in cmdline) and 'serve' in cmdline:
                uptime = datetime.now().timestamp() - proc.info['create_time']
                info = {
                    'pid': proc.info['pid'],
                    'cpu_percent': round(proc.cpu_percent(interval=0.1), 1),
                    'memory_percent': round(proc.memory_percent(), 2),
                    'uptime': format_uptime(uptime),
                    'command': ' '.join(proc.info['cmdline'] or [])
                }
                vue_processes.append(info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    # Get system metrics
    system_metrics = get_system_metrics()
    
    # Output as JSON
    result = {
        'timestamp': datetime.now().isoformat(),
        'system': system_metrics,
        'processes': {
            'django': django_processes,
            'vue': vue_processes
        }
    }
    
    print(json.dumps(result))

if __name__ == '__main__':
    main()
