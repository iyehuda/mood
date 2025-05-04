from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from llm_service.api.router import api_router
from llm_service.core.config import settings

app = FastAPI(
    title="Mood",
    root_path=settings.ROOT_PATH,
)

if settings.all_cors_origins:
    # noinspection PyTypeChecker
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)
