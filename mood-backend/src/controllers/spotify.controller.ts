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

            if (!Array.isArray(songs) || songs.length === EMPTY_ARRAY_LENGTH) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'Invalid request. Please provide an array of song names.'
                });
                return;
            }

            const results = await spotifyService.searchSongs(songs);

            res.json({
                data: results,
                success: true
            });
        } catch (error) {
            console.error('Error in getSongLinks controller:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                error: 'Internal server error'
            });
        }
    }
}; 