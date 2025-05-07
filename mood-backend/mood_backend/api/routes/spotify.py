from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException

from mood_backend.models.spotify import (
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    SearchSongsRequest,
    SearchSongsResponse,
)
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
