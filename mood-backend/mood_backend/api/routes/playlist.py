from fastapi import APIRouter, Depends, BackgroundTasks
from mood_backend.services.spotify_service import SpotifyService, SpotifyContext
from mood_backend.services.playlist_service import PlaylistService
from mood_backend.api.routes.spotify import get_spotify_context

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
        playlist_id,
        playlist_name,
        mood,
        spotify_context
    )
    
    return {"message": "Playlist regeneration scheduled"} 