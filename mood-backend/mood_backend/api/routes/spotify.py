from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Path

from mood_backend.models.spotify import (
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    SearchSongsRequest,
    SearchSongsResponse,
    SavedPlaylist,
)
from mood_backend.services.spotify_service import SpotifyContext, SpotifyService
from mood_backend.services.playlist_service import PlaylistService

router = APIRouter(tags=["Spotify"])


async def get_spotify_context(
    x_spotify_token: Annotated[str | None, Header()] = None,
) -> SpotifyContext:
    if not x_spotify_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return SpotifyContext(access_token=x_spotify_token)


async def get_spotify_user_id(
    spotify_context: SpotifyContext = Depends(get_spotify_context),
    spotify_service: SpotifyService = Depends(SpotifyService),
) -> str:
    return await spotify_service._get_spotify_user_id(spotify_context)


SpotifyUserID = Annotated[str, Depends(get_spotify_user_id)]


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
    "/playlist/save",
    response_model=SavedPlaylist,
)
async def save_playlist(
    playlist_name: str,
    playlist_url: str,
    user_id: SpotifyUserID,
):
    return await PlaylistService.save_playlist_to_db(user_id, playlist_name, playlist_url)


@router.get(
    "/playlists",
    response_model=list[SavedPlaylist],
)
async def get_playlists(
    user_id: SpotifyUserID,
):
    return await PlaylistService.get_saved_playlists_for_user(user_id)


@router.delete(
    "/playlist/{playlist_id}",
    response_model=bool,
)
async def delete_playlist(
    user_id: SpotifyUserID,
    playlist_id: str,
):
    return await PlaylistService.delete_playlist_by_id(playlist_id, user_id)
