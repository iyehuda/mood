import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mood_backend.api.routes import spotify, playlist
from mood_backend.services.spotify_service import SpotifyService
from mood_backend.services.playlist_service import PlaylistService
from mood_backend.services.scheduler_service import SchedulerService
import asyncio

from mood_backend.core.config import settings

app = FastAPI(
    title="Mood",
    root_path=settings.ROOT_PATH,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
spotify_service = SpotifyService()
playlist_service = PlaylistService(spotify_service)
scheduler_service = SchedulerService(playlist_service)

# Include routers
app.include_router(spotify.router, prefix="/spotify")
app.include_router(playlist.router, prefix="/playlist")

@app.on_event("startup")
async def startup_event():
    # Start the scheduler in the background
    asyncio.create_task(scheduler_service.start_scheduler())

@app.on_event("shutdown")
async def shutdown_event():
    # Stop the scheduler
    scheduler_service.stop_scheduler()

if __name__ == "__main__":
    uvicorn.run(app)
