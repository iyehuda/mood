from datetime import datetime, timedelta
from typing import Dict

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from mood_backend.models.spotify import ScheduledPlaylistRegeneration
from mood_backend.services.spotify_service import SpotifyService


class SchedulerService:
    def __init__(self) -> None:
        self._scheduler = AsyncIOScheduler()
        self._scheduler.start()
        self._scheduled_playlists: Dict[str, ScheduledPlaylistRegeneration] = {}

    def schedule_playlist(
        self, playlist_id: str, interval_hours: int
    ) -> ScheduledPlaylistRegeneration:
        now = datetime.utcnow()
        scheduled = ScheduledPlaylistRegeneration(
            playlist_id=playlist_id,
            interval_hours=interval_hours,
            last_regeneration=None,
            next_regeneration=now + timedelta(hours=interval_hours),
        )
        self._scheduled_playlists[playlist_id] = scheduled

        # Schedule the job with APScheduler
        self._scheduler.add_job(
            self._regenerate_playlist,
            trigger=IntervalTrigger(hours=interval_hours),
            args=[playlist_id],
            id=f"playlist_regeneration_{playlist_id}",
            replace_existing=True,
        )

        return scheduled

    def remove_scheduled_playlist(self, playlist_id: str) -> bool:
        if playlist_id in self._scheduled_playlists:
            # Remove the job from APScheduler
            self._scheduler.remove_job(f"playlist_regeneration_{playlist_id}")
            del self._scheduled_playlists[playlist_id]
            return True
        return False

    def get_scheduled_playlist(self, playlist_id: str) -> ScheduledPlaylistRegeneration | None:
        return self._scheduled_playlists.get(playlist_id)

    def get_all_scheduled_playlists(self) -> list[ScheduledPlaylistRegeneration]:
        return list(self._scheduled_playlists.values())

    async def _regenerate_playlist(self, playlist_id: str) -> None:
        """Internal method to handle playlist regeneration"""
        if playlist_id not in self._scheduled_playlists:
            return

        scheduled = self._scheduled_playlists[playlist_id]
        now = datetime.utcnow()

        # Update the schedule
        scheduled.last_regeneration = now
        scheduled.next_regeneration = now + timedelta(hours=scheduled.interval_hours)

        # TODO: Implement the actual playlist regeneration logic here
        # This will be called by APScheduler when it's time to regenerate the playlist

    async def process_due_regenerations(
        self, spotify_service: SpotifyService
    ) -> list[str]:
        now = datetime.utcnow()
        regenerated_playlists = []

        for scheduled in self._scheduled_playlists.values():
            if scheduled.next_regeneration and scheduled.next_regeneration <= now:
                # Update the schedule
                scheduled.last_regeneration = now
                scheduled.next_regeneration = now + timedelta(hours=scheduled.interval_hours)
                regenerated_playlists.append(scheduled.playlist_id)

        return regenerated_playlists 