import logging
from fastapi import APIRouter, HTTPException, Depends, Body

from llm_service.models.song import SongRecommendationRequest, SongRecommendations, MoodPrompt
from llm_service.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)

generate_router = APIRouter(
    prefix="/generate",
    tags=["generate"],
    responses={404: {"description": "Not found"}},
)


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
            }
        },
        500: {"description": "Internal server error"}
    }
)
async def get_song_recommendations(
        request: SongRecommendationRequest = Body(..., examples=[{"mood": "Party"}, {"mood": "Happy"}]),
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
    """
    try:
        logger.info(f"Received song recommendation request for mood: {request.mood}")

        # Create a MoodPrompt object from the request
        mood_prompt = MoodPrompt(
            mood=request.mood,
            custom_prompt=request.custom_prompt if hasattr(request, 'custom_prompt') else None,
            song_count=request.song_count if hasattr(request, 'song_count') else 5
        )

        # Call the async service method
        response = await recommendation_service.get_song_recommendations(mood_prompt)
        # Convert the Pydantic model to a dictionary before returning
        return response.model_dump()
    except Exception as e:
        logger.exception(f"Error processing recommendation request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting song recommendations: {str(e)}"
        )
