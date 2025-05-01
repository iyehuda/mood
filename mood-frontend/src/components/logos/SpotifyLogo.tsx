import spotifyLogo from "../../assets/spotify.svg";
import { SmallLogo } from "./SmallLogo.tsx";

export function SpotifyLogo() {
  return <SmallLogo src={spotifyLogo} alt="Spotify Logo" style={{ marginInlineStart: "0.5rem" }} />;
}
