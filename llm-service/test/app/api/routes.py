import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse

from app.models.song import SongRecommendationRequest, SongRecommendations
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)

# Create API router
generate_router = APIRouter(tags=["generate"])

# Dependency to get recommendation service
def get_recommendation_service():
    """Dependency for injecting the RecommendationService."""
    try:
        return RecommendationService()
    except Exception as e:
        logger.error(f"Error creating recommendation service: {e}")
        raise HTTPException(status_code=500, detail="Service initialization error")

@generate_router.post("/")
async def stream_song_recommendations(
    request: SongRecommendationRequest,
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Stream song recommendations based on user prompt.
    
    Args:
        request: SongRecommendationRequest containing user message
        recommendation_service: Service for generating recommendations
        
    Returns:
        StreamingResponse with song title and artist data
    """
    try:
        logger.info(f"Received streaming song recommendation request: {request.message}")
        
        async def generate_stream():
            async for chunk in recommendation_service.stream_song_recommendations(request.message):
                yield chunk
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream"
        )
    except Exception as e:
        logger.exception(f"Error processing streaming recommendation request: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error streaming song recommendations: {str(e)}"
        ) 