import axios from "axios";
import { getStoredToken } from "./spotifyAuth";

const LLM_API_URL = import.meta.env.VITE_LLM_API_URL || "llm";
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "backend";

interface SongRecommendation {
  title: string;
  artist: string;
}

export interface Song {
  artist: string;
  title: string;
  uri: string | null;
  url: string | null;
}

interface SearchResponse {
  success: boolean;
  data: Song[];
}

const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Get the Spotify token from storage
    const token = getStoredToken();

    if (token) {
      config.headers["X-Spotify-Token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const api = {
  // Get song recommendations from LLM service based on mood
  getSongRecommendations: async (mood: string): Promise<SongRecommendation[]> => {
    const response = await fetch(`${LLM_API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mood: mood,
        num_songs: 5, // Request 5 songs for the playlist
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM service error:", errorText);
      throw new Error("Failed to get song recommendations");
    }

    const data = await response.json();
    return data.songs || [];
  },

  // Generate or regenerate playlist using backend service
  generatePlaylist: async (songs: SongRecommendation[]): Promise<SearchResponse> => {
    const response = await apiClient.post("/spotify/search-songs", {
      songs,
    });

    if (!response.data) {
      console.error("Backend service error:", response);
      throw new Error("Failed to generate playlist");
    }

    return response.data;
  },

  // Create Spotify playlist using backend service
  createSpotifyPlaylist: async (
    playlistName: string,
    songs: Song[],
  ): Promise<{ success: boolean; data?: { playlistUrl: string }; error?: string }> => {
    const songUris = songs.map((song) => song.uri).filter((uri): uri is string => uri !== null);
    try {
      const response = await apiClient.post("/spotify/create-playlist", {
        playlistName,
        songUris,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : "Failed to create Spotify playlist. Please try again.";
      return { success: false, error: errorMessage };
    }
  },
};
