#!/usr/bin/env python3

import requests
import json
import os
import time
from datetime import datetime
import logging
import argparse
from typing import Dict, Any, Optional
from dataclasses import dataclass
from rich.console import Console
from rich.table import Table

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
console = Console()

@dataclass
class EndpointStatus:
    status_code: Optional[int]
    response_time_ms: float
    healthy: bool
    details: Dict[str, Any]
    timestamp: str
    error: Optional[str] = None

class VercelMonitor:
    def __init__(self, env='production', url=None):
        self.env = env
        if env == 'local':
            self.base_url = 'http://localhost:8000'
        elif env == 'preview':
            self.base_url = url or os.getenv('VERCEL_PREVIEW_URL')
            if not self.base_url:
                raise ValueError("Preview URL must be provided or set in VERCEL_PREVIEW_URL")
        else:
            self.base_url = url or os.getenv('VERCEL_URL', 'https://derivativegenius-com.vercel.app')
        
        self.endpoints = {
            'health': '/health/check/',
            'db': '/health/check/db/',
            'storage': '/health/check/storage/',
            'migrations': '/health/check/migrations/',
            'vue': '/vue-status/',
            'firebase': '/firebase-status/'
        }

    def check_endpoint(self, endpoint_name: str) -> EndpointStatus:
        url = f"{self.base_url}{self.endpoints[endpoint_name]}"
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            response_time = (time.time() - start_time) * 1000

            try:
                details = response.json() if response.status_code == 200 else {}
            except json.JSONDecodeError:
                details = {"raw_response": response.text[:200]}

            return EndpointStatus(
                status_code=response.status_code,
                response_time_ms=round(response_time, 2),
                healthy=response.status_code == 200,
                details=details,
                timestamp=datetime.now().isoformat()
            )

        except requests.RequestException as e:
            return EndpointStatus(
                status_code=None,
                response_time_ms=0,
                healthy=False,
                details={},
                timestamp=datetime.now().isoformat(),
                error=str(e)
            )

    def run_checks(self, specific_endpoint=None) -> Dict[str, EndpointStatus]:
        results = {}
        endpoints_to_check = ([specific_endpoint] if specific_endpoint 
                            else self.endpoints.keys())

        for endpoint in endpoints_to_check:
            logger.info(f"Checking {endpoint}...")
            results[endpoint] = self.check_endpoint(endpoint)

        return results

    def generate_report(self, results: Dict[str, EndpointStatus]):
        table = Table(title=f"Health Check Report - {self.env.upper()}")
        table.add_column("Endpoint")
        table.add_column("Status")
        table.add_column("Response Time")
        table.add_column("Details")

        for endpoint, result in results.items():
            status = "✅" if result.healthy else "❌"
            details = (f"Error: {result.error}" if result.error 
                      else json.dumps(result.details, indent=2))
            table.add_row(
                endpoint,
                status,
                f"{result.response_time_ms}ms",
                details
            )

        console.print(table)

def main():
    parser = argparse.ArgumentParser(description='Vercel Monitor')
    parser.add_argument('--env', default='production', 
                       choices=['production', 'preview', 'local'],
                       help='Environment to monitor')
    parser.add_argument('--url', help='Override deployment URL')
    parser.add_argument('--endpoint', help='Check specific endpoint')
    parser.add_argument('--report', action='store_true', 
                       help='Generate detailed report')
    parser.add_argument('--compare', action='store_true',
                       help='Compare environments')
    args = parser.parse_args()

    try:
        monitor = VercelMonitor(args.env, args.url)
        results = monitor.run_checks(args.endpoint)

        if args.report:
            monitor.generate_report(results)
        elif args.compare:
            # Compare with local environment
            local_monitor = VercelMonitor('local')
            local_results = local_monitor.run_checks(args.endpoint)
            
            console.print("\n=== Environment Comparison ===")
            monitor.generate_report(results)
            console.print("\n=== Local Environment ===")
            local_monitor.generate_report(local_results)
        else:
            # Simple status output
            all_healthy = all(result.healthy for result in results.values())
            status = "✅ All systems operational!" if all_healthy else "❌ Issues detected!"
            console.print(f"\n{status}")

    except Exception as e:
        logger.error(f"Monitoring failed: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()
