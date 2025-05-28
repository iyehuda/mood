import axios from "axios";
import { getStoredToken } from "./spotifyAuth";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "api";

interface SongRecommendation {
  title: string;
  artist: string;
  reason: string;
}

export interface Song {
  artist: string;
  title: string;
  uri: string | null;
  url: string | null;
}

interface SearchResponse {
  songs: Song[];
}

interface CreatePlaylistResponse {
  playlistUrl: string;
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
    const response = await apiClient.post("/recommend", {
      mood: mood,
      num_songs: 5,
    });
    const { data } = response;

    if (!data) {
      console.error("Backend service error:", response);
      throw new Error("Failed to get song recommendations");
    }

    return data.songs;
  },

  // Generate or regenerate playlist using backend service
  generatePlaylist: async (songs: SongRecommendation[]): Promise<SearchResponse> => {
    console.log("Sending search request with songs:", songs);
    
    const response = await apiClient.post("/spotify/search", {
      songs: songs.map(({ artist, title }: SongRecommendation) => ({ artist, title })),
    });

    console.log("Raw response from /spotify/search:", response);

    if (!response.data) {
      console.error("Backend service error: empty response data");
      throw new Error("Failed to generate playlist - empty response");
    }

    if (!response.data.songs || !Array.isArray(response.data.songs)) {
      console.error("Invalid response format:", response.data);
      throw new Error("Failed to generate playlist - invalid response format");
    }

    console.log(`Successfully fetched ${response.data.songs.length} songs from Spotify`);
    return response.data;
  },

  // Create Spotify playlist using backend service
  createSpotifyPlaylist: async (
    playlistName: string,
    songs: Song[],
  ): Promise<CreatePlaylistResponse> => {
    const songUris = songs.map((song) => song.uri).filter((uri): uri is string => uri !== null);
    try {
      const response = await apiClient.post("/spotify/playlist", {
        playlistName,
        songUris,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to create Spotify playlist. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
