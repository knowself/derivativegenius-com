from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from google.cloud import tasks_v2
from google.auth.exceptions import DefaultCredentialsError
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import os

from api.routers.auth import verify_token

router = APIRouter()

# Initialize Cloud Tasks client with error handling
try:
    client = tasks_v2.CloudTasksClient()
except DefaultCredentialsError:
    print("Warning: Google Cloud credentials not found. Job submission will be disabled.")
    client = None

class JobRequest(BaseModel):
    job_type: str
    params: Dict[str, Any]
    callback_url: Optional[str] = None

def create_cloud_task(job_request: JobRequest, user_id: str):
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Job submission is currently disabled. Google Cloud credentials not configured."
        )
    project = os.getenv("GOOGLE_CLOUD_PROJECT")
    queue = os.getenv("CLOUD_TASKS_QUEUE")
    location = os.getenv("CLOUD_TASKS_LOCATION", "us-central1")
    service_url = os.getenv("CLOUD_RUN_SERVICE_URL")

    parent = client.queue_path(project, location, queue)
    
    task = {
        "http_request": {
            "http_method": tasks_v2.HttpMethod.POST,
            "url": f"{service_url}/process",
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "job_type": job_request.job_type,
                "params": job_request.params,
                "user_id": user_id,
                "callback_url": job_request.callback_url
            }).encode()
        }
    }

    return client.create_task(request={"parent": parent, "task": task})

@router.post("/submit")
async def submit_job(
    job_request: JobRequest,
    background_tasks: BackgroundTasks,
    token: dict = Depends(verify_token)
):
    try:
        # Create a Cloud Task
        task = create_cloud_task(job_request, token["uid"])
        
        return {
            "status": "submitted",
            "task_name": task.name,
            "job_type": job_request.job_type
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit job: {str(e)}"
        )

@router.get("/status/{task_name}")
async def get_job_status(
    task_name: str,
    token: dict = Depends(verify_token)
):
    try:
        # Get task status from Cloud Tasks
        task = client.get_task(name=task_name)
        
        return {
            "status": task.state.name,
            "create_time": task.create_time,
            "schedule_time": task.schedule_time
        }
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Task not found: {str(e)}"
        )
