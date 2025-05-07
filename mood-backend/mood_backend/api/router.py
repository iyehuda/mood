from fastapi import APIRouter

from .routes import recommend, spotify

api_router = APIRouter()
api_router.include_router(recommend.router, prefix="/recommend")
api_router.include_router(spotify.router, prefix="/spotify")
