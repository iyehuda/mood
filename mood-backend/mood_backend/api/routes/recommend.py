from fastapi import APIRouter, Depends

from mood_backend.models.recommendations import (
    SongRecommendationRequest,
    SongRecommendationResponse,
)
from mood_backend.services.recommendation_service import RecommendationService

router = APIRouter(tags=["Recommendation"])


@router.post(
    "",
    response_model=SongRecommendationResponse,
)
async def get_song_recommendations(
    request: SongRecommendationRequest,
    recommendation_service: RecommendationService = Depends(RecommendationService),
) -> SongRecommendationResponse:
    songs = await recommendation_service.get_song_recommendations(request)

    return SongRecommendationResponse(songs=songs, total=len(songs))
