import asyncio
from datetime import datetime, time
from typing import Dict, List
from mood_backend.services.playlist_service import PlaylistService
from mood_backend.services.spotify_service import SpotifyService, SpotifyContext
from mood_backend.core.config import settings

class SchedulerService:
    def __init__(self, playlist_service: PlaylistService):
        self.playlist_service = playlist_service
        self.scheduled_playlists: Dict[str, Dict] = {}
        self.is_running = False
        self.default_schedule_time = time(
            hour=settings.PLAYLIST_SCHEDULE_HOUR,
            minute=settings.PLAYLIST_SCHEDULE_MINUTE
        )

    def schedule_playlist(
        self,
        playlist_id: str,
        playlist_name: str,
        mood: str,
        spotify_context: SpotifyContext,
        schedule_time: time | None = None  # Updated type hint to allow None
    ):
        if schedule_time is None:
            schedule_time = self.default_schedule_time
            
        self.scheduled_playlists[playlist_id] = {
            "playlist_name": playlist_name,
            "mood": mood,
            "spotify_context": spotify_context,
            "schedule_time": schedule_time
        }

    def unschedule_playlist(self, playlist_id: str):
        if playlist_id in self.scheduled_playlists:
            del self.scheduled_playlists[playlist_id]

    async def start_scheduler(self):
        if self.is_running:
            return

        self.is_running = True
        while self.is_running:
            now = datetime.now().time()
            
            for playlist_data in self.scheduled_playlists.values():
                if playlist_data["schedule_time"].hour == now.hour and \
                   playlist_data["schedule_time"].minute == now.minute:
                    await self.playlist_service.regenerate_playlist(
                        playlist_data["playlist_name"],
                        playlist_data["spotify_context"]
                    )
            
            # Sleep for 1 minute before checking again
            await asyncio.sleep(60)

    def stop_scheduler(self):
        self.is_running = False 