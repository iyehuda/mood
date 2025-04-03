import logging
from typing import Any, Dict, List, Generator

from langchain_core.output_parsers import JsonOutputParser

from app.models.song import Song, SongRecommendations
from app.prompts.song_recommendations import SIMPLE_SONG_RECOMMENDATION_PROMPT
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class RecommendationService:
    """Service for generating song recommendations based on user mood."""

    def __init__(self, llm_service: LLMService = None):
        """
        Initialize the recommendation service.
        
        Args:
            llm_service: LLM service for generating recommendations. If None, a new instance will be created.
        """
        try:
            self.llm_service = llm_service or LLMService()
            logger.info("Recommendation service initialized")
        except Exception as e:
            logger.error(f"Error initializing recommendation service: {e}")
            raise

    async def get_song_recommendations(self, mood: str, song_count: int = 5) -> Dict[str, List[Dict[str, str]]]:
        """
        Get song recommendations based on user mood.
        
        Args:
            mood: The user's mood or emotion to base recommendations on
            song_count: Number of songs to recommend (default: 5)
            
        Returns:
            Dictionary containing a list of song recommendations, each with title and artist
            
        Example:
            {
                "songs": [
                    {"title": "Don't Stop Me Now", "artist": "Queen"},
                    {"title": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars"}
                ]
            }
        """
        try:
            logger.info(f"Getting song recommendations for mood: {mood}")

            # Setup parser for JSON output without schema enforcement
            parser = JsonOutputParser()

            # Get recommendations
            inputs = {"message": mood, "song_count": song_count}
            response = self.llm_service.generate_response(
                prompt_template=SIMPLE_SONG_RECOMMENDATION_PROMPT,
                inputs=inputs,
                output_parser=parser
            )
            return response
        except Exception as e:
            logger.error(f"Error getting song recommendations: {e}")
            return {"songs": []}

    async def stream_song_recommendations(self, mood: str, song_count: int = 5) -> Generator[str, None, None]:
        """
        Stream song recommendations based on user mood.
        
        Args:
            mood: The user's mood or emotion to base recommendations on
            song_count: Number of songs to recommend (default: 5)
            
        Yields:
            Chunks of recommendation data as strings
            
        Example:
            Each chunk will be a JSON string like:
            {"songs": [{"title": "Don't Stop Me Now", "artist": "Queen"}]}
        """
        try:
            logger.info(f"Streaming song recommendations for mood: {mood}")

            # Setup parser for JSON output without schema enforcement
            parser = JsonOutputParser()

            # Stream recommendations
            inputs = {"message": mood, "song_count": song_count}
            async for chunk in self.llm_service.stream_response(
                    prompt_template=SIMPLE_SONG_RECOMMENDATION_PROMPT,
                    inputs=inputs,
                    output_parser=parser
            ):
                yield f"{chunk}\n"
        except Exception as e:
            logger.error(f"Error streaming song recommendations: {e}")
            yield f"Error: {str(e)}\n"
