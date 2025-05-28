from pydantic import BaseModel
from datetime import time

class PlaylistScheduleRequest(BaseModel):
    playlist_id: str
    playlist_name: str
    mood: str
    schedule_time: time | None = None  # Optional, will use default from settings if not provided 