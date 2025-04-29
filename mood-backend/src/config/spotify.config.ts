export const spotifyConfig = {
  authUrl: "https://accounts.spotify.com/api/token",
  baseUrl: "https://api.spotify.com/v1",
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
};
