import asyncio
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from mood_backend.core.config import settings
from mood_backend.models.spotify import SavedPlaylist

# MongoDB client and collection setup
mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
db = mongo_client.get_default_database()
playlists_collection = db["playlists"]

class PlaylistService:
    @staticmethod
    async def save_playlist_to_db(user_id: str, playlist_name: str, playlist_url: str):
        playlist = SavedPlaylist(
            user_id=user_id,
            playlist_name=playlist_name,
            playlist_url=playlist_url,
        )
        result = await playlists_collection.insert_one(playlist.model_dump(exclude={"id"}))
        playlist_dict = playlist.model_dump()
        playlist_dict["_id"] = str(result.inserted_id)
        return SavedPlaylist(**playlist_dict)

    @staticmethod
    async def get_saved_playlists_for_user(user_id: str) -> list[SavedPlaylist]:
        cursor = playlists_collection.find({"user_id": user_id})
        playlists = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            playlists.append(SavedPlaylist(**doc))
        return playlists

    @staticmethod
    async def delete_playlist_by_id(playlist_id: str, user_id: str) -> bool:
        result = await playlists_collection.delete_one({"_id": ObjectId(playlist_id), "user_id": user_id})
        return result.deleted_count == 1 