import { Request, Response } from "express";
import { SpotifyService, spotifyService } from "../services/spotify.service";

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const EMPTY_ARRAY_LENGTH = 0;

export const spotifyController = {
  // eslint-disable-next-line max-statements
  createPlaylist: async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract token from header (adjust header name if frontend uses a different one)
        const userAccessToken = req.headers['x-spotify-token'] as string;
        if (!userAccessToken) {
            // Use BAD_REQUEST or UNAUTHORIZED (401) based on your preference
            res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing Spotify token in x-spotify-token header', success: false });
            return;
        }

        // Get required data from body
        const { playlistName, songUris } = req.body;

        // Validate body parameters
        if (!playlistName || typeof playlistName !== 'string') {
            throw new Error('Invalid request. playlistName is required and must be a string.');
        }
        if (!Array.isArray(songUris) || !songUris.every(uri => typeof uri === 'string' || uri === null)) {
            throw new Error('Invalid request. songUris must be an array of strings or null.');
        }

        // Fetch the actual Spotify User ID using the provided token
        const userId = await SpotifyService.getCurrentUserId(userAccessToken);

        // Filter null URIs before passing to service
        const validSongUris = songUris.filter((uri): uri is string => uri !== null);

        // Call the service with the params object
        const playlistUrl = await SpotifyService.createPlaylist({
            playlistName,
            // Pass the filtered array
            songUris: validSongUris, 
            userAccessToken,
            userId,
        });

        res.json({ data: { playlistUrl }, success: true });
    } catch (error) {
        spotifyController.handleError(error, res);
    }
  },
  getSongLinks: async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract token from header
      const userAccessToken = req.headers['x-spotify-token'] as string;
      if (!userAccessToken) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing Spotify token in x-spotify-token header', success: false });
          return;
      }

      const { songs } = req.body;
      spotifyController.validateSongsInput(songs);

      const results = await spotifyService.searchSongs(songs);
      res.json({ data: results, success: true });
    } catch (error) {
      spotifyController.handleError(error, res);
    }
  },
  handleError(error: unknown, res: Response): void {
    console.error("Error in getSongLinks controller:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode =
      error instanceof Error && error.message.includes("Failed to get Spotify access token")
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      error: errorMessage,
      success: false,
    });
  },
  validateSongsInput(songs: unknown): void {
    if (!Array.isArray(songs) || songs.length === EMPTY_ARRAY_LENGTH) {
      throw new Error("Invalid request. Please provide an array of songs.");
    }

    const isValidSong = (song: unknown): song is { title: string; artist: string } =>
      typeof song === "object" &&
      song !== null &&
      "title" in song &&
      "artist" in song &&
      typeof song.title === "string" &&
      typeof song.artist === "string";

    if (!songs.every(isValidSong)) {
      throw new Error("Invalid request. Each song must have a title and artist property.");
    }
  },
};
