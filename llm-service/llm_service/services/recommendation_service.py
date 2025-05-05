from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

from llm_service.core.config import settings
from llm_service.models.recommendations import (
    RecommendedSong,
    SongRecommendationRequest,
)

SIMPLE_SONG_RECOMMENDATION_PROMPT = """
You are a music expert with deep knowledge of songs across all genres, artists, and time periods.
Based on the following message, recommend {song_count} songs that are relevant to the theme, mood, or content of the message.

User Message: {message}

Provide exactly {song_count} song recommendations, with each song including:
- Title
- Artist
- Reason why this song matches the mood or theme

Format your response as a valid JSON object with a 'songs' array containing all {song_count} songs.
Each song should have the following fields: "title", "artist", and "reason".
"""


class RecommendationService:
    def __init__(self) -> None:
        prompt = PromptTemplate(
            template=SIMPLE_SONG_RECOMMENDATION_PROMPT,
            input_variables=["message", "song_count"],
        )
        llm = ChatGoogleGenerativeAI(
            model=settings.RECOMMENDATION_MODEL_NAME,
            temperature=settings.RECOMMENDATION_MODEL_TEMPERATURE,
            google_api_key=settings.GOOGLE_API_KEY,
        )
        self._chain = prompt | llm | JsonOutputParser()

    async def get_song_recommendations(
        self, request: SongRecommendationRequest
    ) -> list[RecommendedSong]:
        response: dict[str, list[dict[str, str]]] = await self._chain.ainvoke(
            {"message": request.mood, "song_count": request.song_count}
        )

        return [RecommendedSong(**song) for song in response.get("songs", [])]
