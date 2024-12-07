from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from firebase_admin import initialize_app
import firebase_admin
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(
    title="DG Web API",
    description="FastAPI backend for DG Web Application",
    version="1.0.0"
)

# Initialize Firebase Admin SDK
try:
    firebase_app = initialize_app()
except ValueError:
    # App already initialized
    firebase_app = firebase_admin.get_app()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# Import routers
from api.routers import auth, jobs

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
