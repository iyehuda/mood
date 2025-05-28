from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from mood_backend.services.spotify_service import SpotifyService, SpotifyContext
from mood_backend.services.playlist_service import PlaylistService
from mood_backend.services.scheduler_service import SchedulerService
from mood_backend.api.routes.spotify import get_spotify_context
from mood_backend.models.playlist import PlaylistScheduleRequest

router = APIRouter(tags=["Playlist"])

@router.post("/regenerate")
async def regenerate_playlist(
    playlist_id: str,
    playlist_name: str,
    mood: str,
    background_tasks: BackgroundTasks,
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
) -> dict:
    playlist_service = PlaylistService(spotify_service)
    
    # Add the regeneration task to background tasks
    background_tasks.add_task(
        playlist_service.regenerate_playlist,
        playlist_name,
        spotify_context
    )
    
    return {"message": "Playlist regeneration scheduled"}

@router.post("/schedule")
async def schedule_playlist(
    request: PlaylistScheduleRequest,
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
    scheduler_service: SchedulerService = Depends(SchedulerService),
) -> dict:
    try:
        scheduler_service.schedule_playlist(
            playlist_id=request.playlist_id,
            playlist_name=request.playlist_name,
            mood=request.mood,
            spotify_context=spotify_context,
            schedule_time=request.schedule_time
        )
        return {"message": f"Playlist {request.playlist_id} scheduled for regeneration"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/schedule/{playlist_id}")
async def unschedule_playlist(
    playlist_id: str,
    scheduler_service: SchedulerService = Depends(SchedulerService),
) -> dict:
    try:
        scheduler_service.unschedule_playlist(playlist_id)
        return {"message": f"Playlist {playlist_id} removed from regeneration schedule"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 