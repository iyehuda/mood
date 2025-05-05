import axios from "axios";
import { spotifyConfig } from "../config";

const MILLISECONDS_PER_SECOND = 1000;
const INITIAL_TOKEN_EXPIRATION = 0;
const SEARCH_LIMIT = 1;
const EMPTY_ARRAY_LENGTH = 0;

interface SongSearch {
  title: string;
  artist: string;
}

interface SongResult {
  title: string;
  artist: string;
  url: string | null;
  uri: string | null;
}

// Define the interface outside the class
interface CreatePlaylistParams {
  userId: string;
  playlistName: string;
  songUris: string[];
  userAccessToken: string;
}

// Export the class
export class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpirationTime: number = INITIAL_TOKEN_EXPIRATION;

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpirationTime) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString(
      "base64",
    );

    try {
      const response = await axios.post(spotifyConfig.authUrl, "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      this.accessToken = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * MILLISECONDS_PER_SECOND;
      return this.accessToken;
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      throw new Error("Failed to get Spotify access token");
    }
  }

  async searchSongs(songs: SongSearch[]): Promise<SongResult[]> {
    const accessToken = await this.getAccessToken();

    return await Promise.all(
      songs.map(async ({ title, artist }) => {
        try {
          const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              limit: SEARCH_LIMIT,
              query: `track:${title} artist:${artist}`,
              type: "track",
            },
          });

          const [track] = response.data.tracks.items;
          return {
            artist,
            title,
            uri: track ? track.uri : null,
            url: track ? track.external_urls.spotify : null,
          };
        } catch (error) {
          console.error(`Error searching for song "${title}" by "${artist}":`, error);
          return {
            artist,
            title,
            uri: null,
            url: null,
          };
        }
      }),
    );
  }

  // Fetch the current user's Spotify ID using their access token
  static async getCurrentUserId(userAccessToken: string): Promise<string> {
    try {
      const response = await axios.get(`${spotifyConfig.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return response.data.id;
    } catch (error) {
      console.error("Error fetching Spotify User ID:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Spotify API Error (Fetching User ID):", error.response.data);
      }
      throw new Error(
        "Failed to fetch Spotify User ID. Is the token valid and has user-read-private scope?",
      );
    }
  }

  // --- Methods below now require the user's access token to be passed in ---

  private static async addTracksToPlaylist(
    playlistId: string,
    songUris: string[],
    userAccessToken: string,
  ): Promise<void> {
    const MAX_TRACKS_PER_REQUEST = 100;
    for (let index = 0; index < songUris.length; index += MAX_TRACKS_PER_REQUEST) {
      const urisToAdd = songUris.slice(index, index + MAX_TRACKS_PER_REQUEST);
      try {
        // eslint-disable-next-line no-await-in-loop
        await axios.post(
          `${spotifyConfig.baseUrl}/playlists/${playlistId}/tracks`,
          {
            uris: urisToAdd,
          },
          {
            headers: {
              // Use the passed-in user access token
              Authorization: `Bearer ${userAccessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
      } catch (error) {
        console.error(`Error adding batch of tracks starting at index ${index}:`, error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Spotify API Error (Adding Tracks):", error.response.data);
        }
      }
    }
  }

  private static async createEmptyPlaylist(
    userId: string,
    playlistName: string,
    userAccessToken: string,
  ): Promise<{ playlistId: string; playlistUrl: string }> {
    try {
      const response = await axios.post(
        `${spotifyConfig.baseUrl}/users/${userId}/playlists`,
        {
          description: "Created by Mood Playlist Generator",
          name: playlistName,
          // Set to true to make the playlist public
          public: false,
        },
        {
          headers: {
            // Use the passed-in user access token
            Authorization: `Bearer ${userAccessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      return {
        playlistId: response.data.id,
        playlistUrl: response.data.external_urls.spotify,
      };
    } catch (error) {
      console.error(`Error creating empty playlist "${playlistName}" for user ${userId}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Spotify API Error (Creating Empty Playlist):", error.response.data);
      }
      throw new Error("Failed to create empty Spotify playlist shell.");
    }
  }

  private static validateAndFilterSongUris(songUris: string[], playlistName: string): string[] {
    const validSongUris = songUris.filter((uri): uri is string => Boolean(uri));

    if (validSongUris.length === EMPTY_ARRAY_LENGTH) {
      console.warn(
        `No valid Spotify URIs found for playlist "${playlistName}". Playlist will be empty.`,
      );
    }
    return validSongUris;
  }

  // Updated to accept userAccessToken and userId via params object
  static async createPlaylist(params: CreatePlaylistParams): Promise<string> {
    const { userId, playlistName, songUris, userAccessToken } = params;
    try {
      // No need to call ensureAccessToken (which gets client token)

      // Create the playlist shell using the fetched userId and passed user token
      const { playlistId, playlistUrl } = await SpotifyService.createEmptyPlaylist(
        userId,
        playlistName,
        userAccessToken,
      );

      const validSongUris = SpotifyService.validateAndFilterSongUris(songUris, playlistName);

      // Return early if no valid songs to add
      if (validSongUris.length === EMPTY_ARRAY_LENGTH) {
        return playlistUrl;
      }

      // Add tracks to the playlist using the passed user token
      await SpotifyService.addTracksToPlaylist(playlistId, validSongUris, userAccessToken);

      return playlistUrl;
    } catch (error) {
      console.error(`Error in createPlaylist process for "${playlistName}":`, error);
      throw new Error(
        "Failed to create Spotify playlist. Check backend logs and ensure user token has playlist-modify scopes.",
      );
    }
  }
}

export const spotifyService = new SpotifyService();
