from typing import Optional
from datetime import datetime
from mood_backend.services.spotify_service import SpotifyService, SpotifyContext
from mood_backend.models.spotify import CreatePlaylistRequest

class PlaylistService:
    def __init__(self, spotify_service: SpotifyService):
        self.spotify_service = spotify_service

    async def regenerate_playlist(
        self,
        playlist_name: str,
        spotify_context: SpotifyContext
    ) -> Optional[str]:
        try:
            # Get new song recommendations based on mood
            # TODO: Implement getting recommendations from LLM service
            
            # Create new playlist with the same name but with date suffix
            date_suffix = datetime.now().strftime("%Y-%m-%d")
            new_playlist_name = f"{playlist_name} - {date_suffix}"
            
            # Create new playlist with updated songs
            request = CreatePlaylistRequest(
                playlist_name=new_playlist_name,
                song_uris=[]  # TODO: Add song URIs from recommendations
            )
            
            new_playlist_url = await self.spotify_service.create_playlist(request, spotify_context)
            return new_playlist_url
            
        except Exception as e:
            print(f"Error regenerating playlist: {str(e)}")
            return None 