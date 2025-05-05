import logging

from fastapi import APIRouter, Depends

from llm_service.models.recommendations import SongRecommendationRequest, SongRecommendationResponse
from llm_service.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)

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
