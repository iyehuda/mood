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

export default router;
