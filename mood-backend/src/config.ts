import dotenv from "dotenv";

export enum Environment {
  DEV = "development",
  PROD = "production",
}

dotenv.config({ path: [".env", "../.env"] });
const defaults = {
  ENVIRONMENT: Environment.DEV,
  PORT: 3000,
};

export const spotifyConfig = {
  authUrl: "https://accounts.spotify.com/api/token",
  baseUrl: "https://api.spotify.com/v1",
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
};

export const environment = (process.env.NODE_ENV as Environment) ?? defaults.ENVIRONMENT;
export const port = process.env.PORT ?? defaults.PORT;
