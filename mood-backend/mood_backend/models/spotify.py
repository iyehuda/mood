from fastapi_camelcase import CamelModel
from pydantic import BaseModel
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


class ScheduledPlaylistRegeneration(CamelModel):
    playlist_id: str
    interval_hours: int
    last_regeneration: datetime | None = None
    next_regeneration: datetime | None = None


class SchedulePlaylistRequest(CamelModel):
    playlist_id: str
    interval_hours: int


class SchedulePlaylistResponse(CamelModel):
    success: bool
    next_regeneration: datetime
