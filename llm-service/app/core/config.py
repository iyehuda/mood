import os
import logging
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
    GOOGLE_API_KEY: Optional[str] = os.getenv("GOOGLE_API_KEY")
    
    # Model settings
    MODEL_NAME: str = os.getenv("MODEL_NAME", "gemini-2.0-flash")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    def __init__(self):
        """Initialize and validate settings."""
        try:
            # Validate required environment variables
            if not self.GOOGLE_API_KEY:
                raise ValueError("GOOGLE_API_KEY environment variable is required")
            
            # Set environment variable for Google API key
            os.environ["GOOGLE_API_KEY"] = self.GOOGLE_API_KEY
            logger.info("Google API key configured")
            
            # Log other important settings
            logger.info(f"Model: {self.MODEL_NAME}, Temperature: {self.TEMPERATURE}")
            logger.info(f"Server: {self.HOST}:{self.PORT}")
        except Exception as e:
            logger.error(f"Error initializing settings: {e}")
            raise

# Create settings instance
settings = Settings() 