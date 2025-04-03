import logging
from typing import Any, Dict, List, Generator

from langchain_core.output_parsers import JsonOutputParser

from app.models.song import Song, SongRecommendations
from app.prompts.song_recommendations import SIMPLE_SONG_RECOMMENDATION_PROMPT
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class RecommendationService:
    """Service for generating song recommendations."""

    def __init__(self, llm_service: LLMService = None):
        """
        Initialize the recommendation service.
        
        Args:
            llm_service: LLM service for generating recommendations
        """
        try:
            self.llm_service = llm_service or LLMService()
            logger.info("Recommendation service initialized")
        except Exception as e:
            logger.error(f"Error initializing recommendation service: {e}")
            raise

    async def stream_song_recommendations(self, message: str, song_count: int = 5) -> Generator[str, None, None]:
        """
        Stream song recommendations based on user message.
        
        Args:
            message: User message/prompt
            
        Yields:
            Chunks of recommendation data
        """
        try:
            logger.info(f"Streaming song recommendations for message: {message}")

            # Setup parser for JSON output without schema enforcement
            parser = JsonOutputParser()

            # Stream recommendations
            inputs = {"message": message, "song_count": song_count}
            async for chunk in self.llm_service.stream_response(
                    prompt_template=SIMPLE_SONG_RECOMMENDATION_PROMPT,
                    inputs=inputs,
                    output_parser=parser
            ):
                yield f"{chunk}\n"
        except Exception as e:
            logger.error(f"Error streaming song recommendations: {e}")
            yield f"Error: {str(e)}\n"
