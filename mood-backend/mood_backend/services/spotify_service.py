import asyncio
from dataclasses import dataclass

import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from mood_backend.core.config import settings
from mood_backend.models.spotify import CreatePlaylistRequest, SongResult, SongSearch, SavedPlaylist
from bson import ObjectId

# MongoDB client and collection setup
mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
db = mongo_client.get_default_database()
playlists_collection = db["playlists"]


@dataclass
class SpotifyContext:
    access_token: str


@dataclass
class SpotifyPlaylistResult:
    playlist_id: str
    playlist_url: str


class SpotifyService:
    def __init__(
        self, base_url: str = "https://api.spotify.com/v1", search_limit: int = 10
    ) -> None:
        self._client = httpx.AsyncClient(base_url=base_url)
        self._search_limit = search_limit

    async def search_songs(
        self, songs: list[SongSearch], context: SpotifyContext
    ) -> list[SongResult]:
        results = await asyncio.gather(
            *[self.search_song(song, context) for song in songs]
        )

        return [song for song in results if song]

    async def search_song(
        self, song: SongSearch, context: SpotifyContext
    ) -> SongResult | None:
        response = await self._client.get(
            "/search",
            headers={"Authorization": f"Bearer {context.access_token}"},
            params={
                "limit": self._search_limit,
                "q": f"track:{song.title} artist:{song.artist}",
                "type": "track",
            },
        )
        response.raise_for_status()
        data = response.json()
        tracks = data["tracks"]["items"]

        if not tracks:
            return None

        return SongResult(
            title=tracks[0]["name"],
            artist=tracks[0]["artists"][0]["name"],
            url=tracks[0]["external_urls"]["spotify"],
            uri=tracks[0]["uri"],
            image_url=tracks[0]["album"]["images"][0]["url"] if tracks[0]["album"]["images"] else None,
        )

    async def create_playlist(
        self, request: CreatePlaylistRequest, context: SpotifyContext
    ) -> str:
        playlist = await self._create_empty_playlist(request.playlist_name, context)

        await self._add_songs_to_playlist(
            playlist.playlist_id, request.song_uris, context
        )

        return playlist.playlist_url

    async def _get_spotify_user_id(self, context: SpotifyContext) -> str:
        response = await self._client.get(
            "/me", headers={"Authorization": f"Bearer {context.access_token}"}
        )
        response.raise_for_status()
        data: dict[str, str] = response.json()

        return data["id"]

    async def _create_empty_playlist(
        self, playlist_name: str, context: SpotifyContext
    ) -> SpotifyPlaylistResult:
        user_id = await self._get_spotify_user_id(context)
        response = await self._client.post(
            f"/users/{user_id}/playlists",
            headers={"Authorization": f"Bearer {context.access_token}"},
            json={
                "name": playlist_name,
                "description": "Created by Mood playlist generator",
                "public": False,
            },
        )
        response.raise_for_status()
        data = response.json()

        return SpotifyPlaylistResult(
            playlist_id=data["id"],
            playlist_url=data["external_urls"]["spotify"],
        )

    async def _add_songs_to_playlist(
        self, playlist_id: str, song_uris: list[str], context: SpotifyContext
    ) -> None:
        response = await self._client.post(
            f"/playlists/{playlist_id}/tracks",
            headers={"Authorization": f"Bearer {context.access_token}"},
            json={"uris": song_uris},
        )
        response.raise_for_status()
