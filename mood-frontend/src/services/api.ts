const LLM_API_URL = import.meta.env.VITE_LLM_API_URL;
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'romantic' | 'angry' | 'focused' | 'party';

interface SongRecommendation {
  title: string;
  artist: string;
}

interface PlaylistResponse {
  playlistUrl: string;
  songs: Array<{
    title: string;
    artist: string;
    spotifyUrl: string;
  }>;
}

export const api = {
  // Get song recommendations from LLM service based on mood
  getSongRecommendations: async (mood: Mood): Promise<SongRecommendation[]> => {
    const response = await fetch(`${LLM_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: mood,
        num_songs: 5  // Request 5 songs for the playlist
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM service error:', errorText);
      throw new Error('Failed to get song recommendations');
    }

    const data = await response.json();
    return data.songs || [];
  },

  // Generate or regenerate playlist using backend service
  generatePlaylist: async (songs: SongRecommendation[]): Promise<PlaylistResponse> => {
    const response = await fetch(`${BACKEND_API_URL}/spotify/search-songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songs: songs.map(song => ({
          title: song.title,
          artist: song.artist
        }))
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend service error:', errorText);
      throw new Error('Failed to generate playlist');
    }

    return response.json();
  },
}; 