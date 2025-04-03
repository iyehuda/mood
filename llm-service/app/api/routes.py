import logging
from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.responses import StreamingResponse, JSONResponse

from app.models.song import SongRecommendationRequest, SongRecommendations
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)

# Create API router
generate_router = APIRouter(
    prefix="/generate",
    tags=["generate"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get recommendation service
def get_recommendation_service():
    """Dependency for injecting the RecommendationService."""
    try:
        return RecommendationService()
    except Exception as e:
        logger.error(f"Error creating recommendation service: {e}")
        raise HTTPException(status_code=500, detail="Service initialization error")

@generate_router.post(
    "/",
    response_model=SongRecommendations,
    responses={
        200: {
            "description": "Successfully generated song recommendations",
            "content": {
                "application/json": {
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
            }
        },
        500: {"description": "Internal server error"}
    }
)
async def get_song_recommendations(
    request: SongRecommendationRequest = Body(..., example={"mood": "Party"}),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get song recommendations based on user mood.
    
    Args:
        request: SongRecommendationRequest containing the user's mood
        recommendation_service: Service for generating recommendations
        
    Returns:
        JSONResponse with song recommendations
        
    Example Request:
        {
            "mood": "Party"
        }
        
    Example Response:
        {
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
    """
    try:
        logger.info(f"Received song recommendation request for mood: {request.mood}")
        
        response = await recommendation_service.get_song_recommendations(request.mood)
        return JSONResponse(content=response)
    except Exception as e:
        logger.exception(f"Error processing recommendation request: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting song recommendations: {str(e)}"
        )

@generate_router.post(
    "/stream",
    responses={
        200: {
            "description": "Successfully streaming song recommendations",
            "content": {
                "text/event-stream": {
                    "example": '{"songs": [{"title": "Don\'t Stop Me Now", "artist": "Queen"}]}\n'
                }
            }
        },
        500: {"description": "Internal server error"}
    }
)
async def stream_song_recommendations(
    request: SongRecommendationRequest = Body(..., example={"mood": "Party"}),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Stream song recommendations based on user mood.
    
    Args:
        request: SongRecommendationRequest containing the user's mood
        recommendation_service: Service for generating recommendations
        
    Returns:
        StreamingResponse with song recommendations as Server-Sent Events
        
    Example Request:
        {
            "mood": "Party"
        }
        
    Example Response:
        Each event will be a JSON string like:
        {"songs": [{"title": "Don't Stop Me Now", "artist": "Queen"}]}
    """
    try:
        logger.info(f"Received streaming song recommendation request for mood: {request.mood}")
        
        async def generate_stream():
            async for chunk in recommendation_service.stream_song_recommendations(request.mood):
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