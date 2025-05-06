from fastapi_camelcase import CamelModel
from pydantic import BaseModel


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
