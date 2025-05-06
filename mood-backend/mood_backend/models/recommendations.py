from pydantic import BaseModel, Field


class RecommendedSong(BaseModel):
    """
    A song recommendation.
    """

    title: str = Field(description="The song title")
    artist: str = Field(description="The song author")
    reason: str = Field(description="The reason for this song recommendation")


class SongRecommendationRequest(BaseModel):
    """
    A request to generate song recommendations based on user mood or emotion.
    """

    mood: str = Field(
        description="The mood or emotion to base song recommendations on",
        examples=["Party", "Happy", "Sad"],
    )
    song_count: int = Field(
        default=5, gt=0, lt=100, description="Number of songs to recommend"
    )


class SongRecommendationResponse(BaseModel):
    """
    A response containing song recommendations.
    """

    songs: list[RecommendedSong] = Field(description="List of song recommendations")
    total: int = Field(description="Total number of recommendations")
