import functions_framework
from flask import Request
import json
import os
from typing import Dict, Any
import httpx

@functions_framework.http
async def process_job(request: Request):
    """Cloud Run function to process long-running jobs."""
    try:
        # Parse request data
        request_json = request.get_json(silent=True)
        if not request_json:
            return {"error": "No JSON data received"}, 400

        job_type = request_json.get("job_type")
        params = request_json.get("params", {})
        user_id = request_json.get("user_id")
        callback_url = request_json.get("callback_url")

        if not all([job_type, user_id]):
            return {"error": "Missing required fields"}, 400

        # Process the job based on type
        result = await process_job_by_type(job_type, params, user_id)

        # Send callback if URL provided
        if callback_url:
            await send_callback(callback_url, result)

        return {"status": "completed", "result": result}, 200

    except Exception as e:
        return {"error": str(e)}, 500

async def process_job_by_type(job_type: str, params: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """Process different types of jobs."""
    if job_type == "llm_process":
        return await process_llm_job(params)
    elif job_type == "data_analysis":
        return await process_data_analysis(params)
    else:
        raise ValueError(f"Unknown job type: {job_type}")

async def process_llm_job(params: Dict[str, Any]) -> Dict[str, Any]:
    """Process LLM-related jobs."""
    # Implement your LLM processing logic here
    return {"status": "completed", "result": "LLM processing completed"}

async def process_data_analysis(params: Dict[str, Any]) -> Dict[str, Any]:
    """Process data analysis jobs."""
    # Implement your data analysis logic here
    return {"status": "completed", "result": "Data analysis completed"}

async def send_callback(callback_url: str, result: Dict[str, Any]):
    """Send callback with job results."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                callback_url,
                json={"status": "completed", "result": result},
                timeout=30.0
            )
            response.raise_for_status()
        except Exception as e:
            print(f"Failed to send callback: {str(e)}")

if __name__ == "__main__":
    # For local development
    import uvicorn
    uvicorn.run("main:process_job", host="0.0.0.0", port=8085, reload=True)
