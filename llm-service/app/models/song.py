from typing import List
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
        example="Party"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "mood": "Party"
            }
        }

class Song(BaseModel):
    """
    Model representing a song recommendation.
    
    Attributes:
        title: The title of the song
        artist: The artist/band name
    """
    title: str = Field(..., description="Song title")
    artist: str = Field(..., description="Artist or band name")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Don't Stop Me Now",
                "artist": "Queen"
            }
        }


class SongRecommendations(BaseModel):
    """
    Model for returning song recommendations.
    
    Attributes:
        songs: List of song recommendations with title and artist only
    """
    songs: List[Song] = Field(..., description="List of song recommendations")

    class Config:
        json_schema_extra = {
            "example": {
                "songs": [
                    {
                        "title": "Don't Stop Me Now",
                        "artist": "Queen"
                    },
                    {
                        "title": "Uptown Funk",
                        "artist": "Mark Ronson ft. Bruno Mars"
                    }
                ]
            }
        } 