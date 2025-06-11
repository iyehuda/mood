from fastapi_camelcase import CamelModel
from pydantic import BaseModel, Field
from datetime import datetime


class SongSearch(BaseModel):
    title: str
    artist: str


class SongResult(BaseModel):
    title: str
    artist: str
    url: str
    uri: str


class SearchSongsRequest(BaseModel):
    songs: list[SongSearch]


class SearchSongsResponse(BaseModel):
    songs: list[SongResult]


class CreatePlaylistRequest(CamelModel):
    playlist_name: str
    song_uris: list[str]


class CreatePlaylistResponse(CamelModel):
    playlist_url: str


class SavedPlaylist(BaseModel):
    id: str = Field(default=None, alias="_id")
    user_id: str = Field(..., description="Spotify user ID")
    playlist_name: str = Field(..., description="Name of the playlist")
    playlist_url: str = Field(..., description="Spotify playlist URL")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="When the playlist was saved")
