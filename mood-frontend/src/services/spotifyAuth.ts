// Spotify authentication service to handle login and token management

// Spotify OAuth configuration
// These values would typically come from environment variables in a real app
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = `${window.location.origin}/callback`;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
];

/**
 * Generate a Spotify authorization URL
 */
export const getAuthUrl = (): string => {
  const scopes = SCOPES.join("%20");
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`;
};

/**
 * Extract access token from URL hash fragment after Spotify auth redirect
 */
export const getTokenFromUrl = (): { accessToken: string; expiresIn: number } | null => {
  if (!window.location.hash) {
    return null;
  }

  const hashParams = window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc: Record<string, string>, item) => {
      const [key, value] = item.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

  if (!hashParams.access_token) {
    return null;
  }

  // Store token with expiration time
  const expiresIn = parseInt(hashParams.expires_in) || 3600; // Default 1 hour if not provided
  const expirationTime = Date.now() + expiresIn * 1000;

  // Store in local storage
  localStorage.setItem("spotify_token", hashParams.access_token);
  localStorage.setItem("spotify_token_expiry", expirationTime.toString());

  return {
    accessToken: hashParams.access_token,
    expiresIn,
  };
};

/**
 * Retrieve a valid token from local storage or return null if expired/not present
 */
export const getStoredToken = (): string | null => {
  const token = localStorage.getItem("spotify_token");
  const expiryTime = localStorage.getItem("spotify_token_expiry");

  if (!token || !expiryTime) {
    return null;
  }

  // Check if the token has expired
  if (Date.now() > parseInt(expiryTime)) {
    // Token expired, clear it
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_token_expiry");
    return null;
  }

  return token;
};

/**
 * Remove the stored token
 */
export const clearToken = (): void => {
  localStorage.removeItem("spotify_token");
  localStorage.removeItem("spotify_token_expiry");
};
