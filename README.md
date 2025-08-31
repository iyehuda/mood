# mood

Generate Spotify playlists from your mood or a custom prompt. Frontend (Vite + React + MUI), Backend (FastAPI), Reverse proxy (Traefik), and MongoDB for saved playlists.

## Features
- Mood buttons or custom prompt → LLM song recommendations
- Fetch tracks from Spotify and preview links
- Create playlists in your Spotify account
- View and delete previously saved playlists

## Architecture
- Traefik on port 80 routes HTTP traffic
  - Frontend: `/` → React app
  - Backend: `/api` → FastAPI (Traefik strips the `/api` prefix)
- Backend: FastAPI + Pydantic; integrates Gemini and Spotify APIs; MongoDB for storage
- Frontend: Vite + React + MUI; uses Spotify Implicit Grant flow (token stored locally)

## Prerequisites
- Docker and Docker Compose
- Spotify Developer app (to obtain `CLIENT_ID`)
- Google API key for recommendations (Gemini)

## Configuration
Create a root `.env` file (used by the backend):

```env
GOOGLE_API_KEY=<your_google_api_key>
MONGODB_URI=mongodb://mongo:27017
```

Create `mood-frontend/.env.local` (used at build time by the frontend):

```env
VITE_SPOTIFY_CLIENT_ID=<your_spotify_client_id>
# Optional (defaults to "api" which works behind Traefik)
VITE_BACKEND_API_URL=api
```

## Run (Docker)
```bash
make compose
```
Open `http://localhost`, click “Log in with Spotify”, approve permissions, pick a mood or enter a prompt, and generate your playlist.

## Backend API (Quick Reference)
- Base URL (via Traefik): `http://localhost/api`
- Auth: Send `X-Spotify-Token: <access_token>` header (obtained from Spotify Implicit Grant on the frontend)

Endpoints:
- `POST /recommend`
  - Body: `{ mood: string, num_songs?: number }`
  - Returns: `{ songs: { title, artist, reason }[], total }`
- `POST /spotify/search`
  - Body: `{ songs: { artist, title }[] }`
  - Returns: `{ songs: { artist, title, uri|null, url|null }[] }`
- `POST /spotify/playlist`
  - Body: `{ playlistName: string, songUris: string[] }`
  - Returns: `{ playlistUrl: string }`
- `POST /spotify/playlist/save`
  - Query params: `playlist_name`, `playlist_url`
  - Returns: saved playlist document
- `GET /spotify/playlists`
  - Returns: saved playlists for the current user
- `DELETE /spotify/playlist/{playlist_id}`
  - Returns: `true` on success

## Local Development (optional)
Frontend:
```bash
cd mood-frontend
npm i
npm run dev   # default http://localhost:5173
```

Backend (via Docker is recommended). If running locally, ensure `.env` exists and `MONGODB_URI` points to a running MongoDB.

## Troubleshooting
- Blank page or login popup blocked: allow pop-ups for `http://localhost`
- Playlist creation fails: ensure you granted Spotify permissions; token must be valid
- Docker build issues: re-run `make compose` and verify Docker is running

Play the right music for your mood - A college of management CS final project