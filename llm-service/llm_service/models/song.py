from typing import List, Optional

from pydantic import BaseModel, Field


class SongRecommendationRequest(BaseModel):
    """
    Model for receiving song recommendation requests.
    
    Attributes:
        mood: The user's mood or emotion to base song recommendations on
    """
    mood: str = Field(
        ...,
        description="The mood or emotion to base song recommendations on",
        examples=["Party", "Happy", "Sad"]
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "mood": "Party"
                },
                {
                    "mood": "Happy"
                }
            ]
        }


class Song(BaseModel):
    """Model for a single song recommendation."""
    title: str = Field(..., description="The title of the song", examples=["Don't Stop Me Now", "Uptown Funk"])
    artist: str = Field(..., description="The artist of the song", examples=["Queen", "Mark Ronson ft. Bruno Mars"])
    reason: Optional[str] = Field(None, description="Reason why this song matches the mood",
                                  examples=["Upbeat and energetic", "Fun and danceable"])

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "title": "Don't Stop Me Now",
                    "artist": "Queen",
                    "reason": "Upbeat and energetic"
                },
                {
                    "title": "Uptown Funk",
                    "artist": "Mark Ronson ft. Bruno Mars",
                    "reason": "Fun and danceable"
                }
            ]
        }


class SongRecommendations(BaseModel):
    """Model for song recommendations response."""
    songs: List[Song] = Field(default_factory=list, description="List of song recommendations")
    total: int = Field(0, description="Total number of recommendations")

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "songs": [
                        {
                            "title": "Don't Stop Me Now",
                            "artist": "Queen",
                            "reason": "Upbeat and energetic"
                        },
                        {
                            "title": "Uptown Funk",
                            "artist": "Mark Ronson ft. Bruno Mars",
                            "reason": "Fun and danceable"
                        }
                    ],
                    "total": 2
                }
            ]
        }


class MoodPrompt(BaseModel):
    """Model for mood prompt input."""
    mood: str = Field(..., description="The mood or emotion to base recommendations on",
                      examples=["Happy", "Sad", "Energetic"])
    custom_prompt: Optional[str] = Field(None, description="Additional context for the recommendation",
                                         examples=["I'm feeling nostalgic about the 80s", "I need music for a workout"])
    song_count: int = Field(default=5, description="Number of songs to recommend", examples=[5, 10])


class LLMConfig(BaseModel):
    """Model for LLM configuration."""
    model: str = Field(default="gpt-3.5-turbo", description="The LLM model to use", examples=["gpt-3.5-turbo", "gpt-4"])
    temperature: float = Field(default=0.7, description="Temperature for response generation", examples=[0.7, 0.5])
    max_tokens: int = Field(default=500, description="Maximum tokens in the response", examples=[500, 1000])
