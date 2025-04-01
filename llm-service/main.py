"""
Main application entry point for the Song Recommendation API.
"""
import logging
import uvicorn

from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import generate_router
from app.utils.error_handlers import ErrorHandlingUtils

logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application
    """
    try:
        # Create FastAPI application
        application = FastAPI(
            title=settings.API_TITLE,
            description=settings.API_DESCRIPTION,
            version=settings.API_VERSION,
            docs_url="/docs",
            redoc_url="/redoc",
            openapi_url="/openapi.json"
        )
        
        # Register exception handlers
        for exception_cls, handler in ErrorHandlingUtils.get_exception_handlers().items():
            application.add_exception_handler(exception_cls, handler)
        
        # Include routers
        application.include_router(generate_router, prefix="/generate")
        
        logger.info("FastAPI application created and configured successfully")
        return application
    except Exception as e:
        logger.error(f"Error creating FastAPI application: {e}")
        raise

# Create FastAPI app
app = create_application()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

# Run the application
if __name__ == "__main__":
    try:
        logger.info(f"Starting application on {settings.HOST}:{settings.PORT}")
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Error starting application: {e}")
        raise 