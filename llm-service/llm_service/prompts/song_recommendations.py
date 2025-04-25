"""
Prompt templates for song recommendation generation.
"""
from llm_service.models.prompt import SongRecommendationPrompt

# Simplified prompt for minimal recommendations
SIMPLE_SONG_RECOMMENDATION_PROMPT = SongRecommendationPrompt(
    template="""
You are a music expert with deep knowledge of songs across all genres, artists, and time periods.
Based on the following message, recommend {song_count} songs that are relevant to the theme, mood, or content of the message.

User Message: {message}

Provide exactly {song_count} song recommendations, with each song including:
- Title
- Artist
- Reason why this song matches the mood or theme

Format your response as a valid JSON object with a 'songs' array containing all {song_count} songs.
Each song should have the following fields: "title", "artist", and "reason".
""",
    input_variables={
        "message": "The user's mood or prompt to base recommendations on",
        "song_count": "Number of songs to recommend"
    },
    song_count=5,
    include_reason=True
).template
