import { Request, Response } from 'express';
import { spotifyService } from '../services/spotify.service';

const HTTP_STATUS = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
} as const;

const EMPTY_ARRAY_LENGTH = 0;

export const spotifyController = {
    getSongLinks: async (req: Request, res: Response): Promise<void> => {
        try {
            const { songs } = req.body;
            spotifyController.validateSongsInput(songs);

            const results = await spotifyService.searchSongs(songs);
            res.json({ data: results, success: true });
        } catch (error) {
            spotifyController.handleError(error, res);
        }
    },
    handleError(error: unknown, res: Response): void {
        console.error('Error in getSongLinks controller:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = error instanceof Error && error.message.includes('Failed to get Spotify access token')
            ? HTTP_STATUS.BAD_REQUEST
            : HTTP_STATUS.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            error: errorMessage,
            success: false
        });
    },
    validateSongsInput(songs: unknown): void {
        if (!Array.isArray(songs) || songs.length === EMPTY_ARRAY_LENGTH) {
            throw new Error('Invalid request. Please provide an array of song names.');
        }
    },
}; 