import os
import logging
from typing import Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

class Settings:
    """Application settings and configuration."""
    
    # API information
    API_TITLE: str = "Song Recommendation API"
    API_DESCRIPTION: str = "API for generating song recommendations based on user prompts"
    API_VERSION: str = "1.0.0"
    
    # Google API key
    GOOGLE_API_KEY: Optional[str] = os.getenv(
        "GOOGLE_API_KEY", "AIzaSyAPIMJsGBguJK5xWbswr-G82-YMqJ2MtbI"
    )
    
    # Model settings
    MODEL_NAME: str = "gemini-2.5-pro-exp-03-25"
    TEMPERATURE: float = 0.7
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    def __init__(self):
        """Initialize and validate settings."""
        try:
            # Set environment variable for Google API key
            if self.GOOGLE_API_KEY:
                os.environ["GOOGLE_API_KEY"] = self.GOOGLE_API_KEY
                logger.info("Google API key configured")
            else:
                logger.warning("Google API key not found in environment variables")
        except Exception as e:
            logger.error(f"Error initializing settings: {e}")
            raise

# Create settings instance
settings = Settings() 