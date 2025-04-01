import { RequestHandler, Router } from 'express';
import { spotifyController } from '../controllers/spotify.controller';

const router = Router();

/**
 * @swagger
 * /spotify/search-songs:
 *   post:
 *     summary: Search for songs on Spotify and get their links
 *     description: Takes an array of song names and returns their Spotify links
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
 *                   type: string
 *                 description: Array of song names to search for
 *                 example: ["Shape of You", "Blinding Lights"]
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
 *                       name:
 *                         type: string
 *                         example: "Shape of You"
 *                       url:
 *                         type: string
 *                         example: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3"
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
router.post('/search-songs', spotifyController.getSongLinks as RequestHandler);

export default router; 