import logging
from langchain_core.output_parsers import JsonOutputParser

from llm_service.models.song import Song, SongRecommendations, MoodPrompt
from llm_service.prompts.song_recommendations import SIMPLE_SONG_RECOMMENDATION_PROMPT
from llm_service.services.llm_service import LLMService

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

    async def get_song_recommendations(self, mood_prompt: MoodPrompt) -> SongRecommendations:
        """
        Get song recommendations based on user mood.
        
        Args:
            mood_prompt: The mood prompt containing mood and optional custom prompt
            
        Returns:
            SongRecommendations object containing list of song recommendations
            
        Example:
            {
                "songs": [
                    {"title": "Don't Stop Me Now", "artist": "Queen", "reason": "Upbeat and energetic"},
                    {"title": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars", "reason": "Fun and danceable"}
                ],
                "total": 2
            }
        """
        try:
            logger.info(f"Getting song recommendations for mood: {mood_prompt.mood}")

            # Setup parser for JSON output
            parser = JsonOutputParser()

            # Get recommendations
            inputs = {
                "message": mood_prompt.mood,
                "song_count": mood_prompt.song_count
            }
            if mood_prompt.custom_prompt:
                inputs["custom_prompt"] = mood_prompt.custom_prompt

            response = await self.llm_service.generate_response(
                prompt_template=SIMPLE_SONG_RECOMMENDATION_PROMPT,
                inputs=inputs,
                output_parser=parser
            )

            # Access the content attribute of the LLMResponse object
            response_content = response.content

            # Convert response to SongRecommendations model
            songs = [Song(**song) for song in response_content.get("songs", [])]
            return SongRecommendations(songs=songs, total=len(songs))

        except Exception as e:
            logger.error(f"Error getting song recommendations: {e}")
            return SongRecommendations(songs=[], total=0)
