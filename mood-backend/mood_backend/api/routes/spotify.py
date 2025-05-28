from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException

from mood_backend.core.config import settings
from mood_backend.models.spotify import (
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    SchedulePlaylistRequest,
    SchedulePlaylistResponse,
    SearchSongsRequest,
    SearchSongsResponse,
)
from mood_backend.services.scheduler_service import SchedulerService
from mood_backend.services.spotify_service import SpotifyContext, SpotifyService

router = APIRouter(tags=["Spotify"])


async def get_spotify_context(
    x_spotify_token: Annotated[str | None, Header()] = None,
) -> SpotifyContext:
    if not x_spotify_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return SpotifyContext(access_token=x_spotify_token)


@router.post(
    "/search",
    response_model=SearchSongsResponse,
)
async def search_songs(
    request: SearchSongsRequest,
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
) -> SearchSongsResponse:
    return SearchSongsResponse(
        songs=await spotify_service.search_songs(request.songs, spotify_context)
    )


@router.post(
    "/playlist",
    response_model=CreatePlaylistResponse,
)
async def create_playlist(
    request: CreatePlaylistRequest,
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
) -> CreatePlaylistResponse:
    return CreatePlaylistResponse(
        playlist_url=await spotify_service.create_playlist(request, spotify_context),
    )


@router.post(
    "/playlist/schedule",
    response_model=SchedulePlaylistResponse,
)
async def schedule_playlist_regeneration(
    request: SchedulePlaylistRequest,
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
    scheduler_service: SchedulerService = Depends(SchedulerService),
) -> SchedulePlaylistResponse:
    # Validate interval
    if request.interval_hours < settings.MIN_REGENERATION_INTERVAL_HOURS:
        raise HTTPException(
            status_code=400,
            detail=f"Interval must be at least {settings.MIN_REGENERATION_INTERVAL_HOURS} hours",
        )
    if request.interval_hours > settings.MAX_REGENERATION_INTERVAL_HOURS:
        raise HTTPException(
            status_code=400,
            detail=f"Interval must be at most {settings.MAX_REGENERATION_INTERVAL_HOURS} hours",
        )

    # Verify playlist exists
    try:
        await spotify_service._client.get(
            f"/playlists/{request.playlist_id}",
            headers={"Authorization": f"Bearer {spotify_context.access_token}"},
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Playlist not found")

    # Schedule the playlist
    scheduled = scheduler_service.schedule_playlist(
        request.playlist_id, request.interval_hours
    )

    return SchedulePlaylistResponse(
        success=True,
        next_regeneration=scheduled.next_regeneration,
    )


@router.delete("/playlist/schedule/{playlist_id}")
async def remove_scheduled_playlist(
    playlist_id: str,
    scheduler_service: SchedulerService = Depends(SchedulerService),
) -> dict[str, bool]:
    success = scheduler_service.remove_scheduled_playlist(playlist_id)
    return {"success": success}
