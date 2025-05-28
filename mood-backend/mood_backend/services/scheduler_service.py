from datetime import time
from typing import Dict
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from mood_backend.services.playlist_service import PlaylistService
from mood_backend.services.spotify_service import SpotifyContext
from mood_backend.core.config import settings

class SchedulerService:
    def __init__(self, playlist_service: PlaylistService):
        self.playlist_service = playlist_service
        self.scheduled_playlists: Dict[str, Dict] = {}
        self.scheduler = AsyncIOScheduler()
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
        schedule_time: time | None = None
    ):
        if schedule_time is None:
            schedule_time = self.default_schedule_time
            
        self.scheduled_playlists[playlist_id] = {
            "playlist_name": playlist_name,
            "mood": mood,
            "spotify_context": spotify_context
        }

        # Schedule the job using APScheduler
        self.scheduler.add_job(
            self._regenerate_playlist,
            CronTrigger(hour=schedule_time.hour, minute=schedule_time.minute),
            id=playlist_id,
            args=[playlist_id]
        )

    def unschedule_playlist(self, playlist_id: str):
        if playlist_id in self.scheduled_playlists:
            self.scheduler.remove_job(playlist_id)
            del self.scheduled_playlists[playlist_id]

    async def _regenerate_playlist(self, playlist_id: str):
        if playlist_id in self.scheduled_playlists:
            playlist_data = self.scheduled_playlists[playlist_id]
            await self.playlist_service.regenerate_playlist(
                playlist_data["playlist_name"],
                playlist_data["spotify_context"]
            )

    def start_scheduler(self):
        if not self.scheduler.running:
            self.scheduler.start()

    def stop_scheduler(self):
        if self.scheduler.running:
            self.scheduler.shutdown() 