from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DG Web API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring service status"""
    return {"status": "healthy", "service": "fastapi"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to DG Web API"}
