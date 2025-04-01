import axios from 'axios';
import { spotifyConfig } from '../config/spotify.config';

const MILLISECONDS_PER_SECOND = 1000;
const INITIAL_TOKEN_EXPIRATION = 0;
const SEARCH_LIMIT = 1;

interface SongSearch {
    title: string;
    artist: string;
}

interface SongResult {
    title: string;
    artist: string;
    url: string | null;
}

class SpotifyService {
    private accessToken: string | null = null;
    private tokenExpirationTime: number = INITIAL_TOKEN_EXPIRATION;

    private async getAccessToken(): Promise<string | null> {
        if (this.accessToken && Date.now() < this.tokenExpirationTime) {
            return this.accessToken;
        }

        const auth = Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64');

        try {
            const response = await axios.post(spotifyConfig.authUrl,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpirationTime = Date.now() + (response.data.expires_in * MILLISECONDS_PER_SECOND);
            return this.accessToken;
        } catch (error) {
            console.error('Error getting Spotify access token:', error);
            throw new Error('Failed to get Spotify access token');
        }
    }

    async searchSongs(songs: SongSearch[]): Promise<SongResult[]> {
        const accessToken = await this.getAccessToken();

        const results = await Promise.all(
            songs.map(async ({ title, artist }) => {
                try {
                    const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            limit: SEARCH_LIMIT,
                            query: `track:${title} artist:${artist}`,
                            type: 'track'
                        }
                    });

                    const [track] = response.data.tracks.items;
                    return {
                        artist,
                        title,
                        url: track ? track.external_urls.spotify : null
                    };
                } catch (error) {
                    console.error(`Error searching for song "${title}" by "${artist}":`, error);
                    return {
                        artist,
                        title,
                        url: null
                    };
                }
            })
        );

        return results;
    }
}

export const spotifyService = new SpotifyService(); 