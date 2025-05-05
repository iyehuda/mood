from fastapi import APIRouter

from .routes import recommend

api_router = APIRouter()
api_router.include_router(recommend.router, prefix="/generate")
