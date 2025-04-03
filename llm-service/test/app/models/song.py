from typing import List
from pydantic import BaseModel, Field

class SongRecommendationRequest(BaseModel):
    """
    Model for receiving song recommendation requests.
    
    Attributes:
        message: The user's prompt text for generating song recommendations
    """
    message: str = Field(..., description="Text prompt for song recommendations")

class Song(BaseModel):
    """
    Model representing a simplified song recommendation with only title and artist.
    
    Attributes:
        title: The title of the song
        artist: The artist/band name
    """
    title: str = Field(..., description="Song title")
    artist: str = Field(..., description="Artist or band name")


class SongRecommendations(BaseModel):
    """
    Model for returning song recommendations.
    
    Attributes:
        songs: List of song recommendations with title and artist only
    """
    songs: List[Song] = Field(..., description="List of song recommendations") 