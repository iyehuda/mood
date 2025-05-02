import { RequestHandler, Router } from "express";
import { spotifyController } from "../controllers/spotify.controller";

const router = Router();

/**
 * @swagger
 * /spotify/search-songs:
 *   post:
 *     summary: Search for songs on Spotify and get their links
 *     description: Takes an array of songs with titles and artists and returns their Spotify links
 *     tags:
 *       - Spotify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songs
 *             properties:
 *               songs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - artist
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Title of the song
 *                       example: "Shape of You"
 *                     artist:
 *                       type: string
 *                       description: Name of the artist
 *                       example: "Ed Sheeran"
 *                 description: Array of songs to search for
 *     responses:
 *       200:
 *         description: Successfully retrieved song links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Shape of You"
 *                       artist:
 *                         type: string
 *                         example: "Ed Sheeran"
 *                       url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3"
 *                       uri:
 *                         type: string
 *                         nullable: true
 *                         example: "spotify:track:7qiZfU4dY1lWllzX7mPBI3"
 *       400:
 *         description: Invalid request - songs array is empty or not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request. Please provide an array of song names."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/search-songs", spotifyController.getSongLinks as RequestHandler);

/**
 * @swagger
 * /spotify/create-playlist:
 *   post:
 *     summary: Create a Spotify playlist
 *     description: Creates a new private Spotify playlist for the user with the given songs.
 *     tags:
 *       - Spotify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - playlistName
 *               - songUris
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The Spotify User ID (currently required, needs auth flow later)
 *                 example: "your_spotify_user_id"
 *               playlistName:
 *                 type: string
 *                 description: Name for the new playlist
 *                 example: "My Awesome Mood Playlist"
 *               songUris:
 *                 type: array
 *                 items:
 *                   type: string
 *                   nullable: true
 *                   description: Spotify Track URI (e.g., spotify:track:xxxx)
 *                   example: "spotify:track:7qiZfU4dY1lWllzX7mPBI3"
 *                 description: Array of Spotify track URIs to add to the playlist
 *     responses:
 *       200:
 *         description: Successfully created playlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     playlistUrl:
 *                       type: string
 *                       description: URL of the created Spotify playlist
 *                       example: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error (e.g., failed to communicate with Spotify)
 */
router.post('/create-playlist', spotifyController.createPlaylist as RequestHandler);

export default router;
