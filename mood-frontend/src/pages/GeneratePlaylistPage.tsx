import { useState } from "react";
import { api, Song } from "../services/api.ts";
import { MoodSelector } from "../components/MoodSelector.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import "../styles/PlaylistGenerator.css";
import { LinkButton } from "../components/buttons/LinkButton.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Mood } from "../components/moods.ts";

type Step = "idle" | "generating" | "fetching" | "complete";
type PlaylistCreationStatus = "idle" | "creating" | "success" | "error";

export const GeneratePlaylistPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("idle");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [playlistCreationStatus, setPlaylistCreationStatus] =
    useState<PlaylistCreationStatus>("idle");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [playlistError, setPlaylistError] = useState<string | null>(null);

  // Check if user is logged in (basic check, needs proper auth flow)
  // const isLoggedIn = !!getStoredToken(); 

  const stepLabels = ["Generating Songs", "Fetching from Spotify"];
  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case "idle":
        return 0;
      case "generating":
        return 1;
      case "fetching":
        return 2;
      case "complete":
        return 2;
      default:
        return 0;
    }
  };

  const generatePlaylist = async (moodOrPrompt: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentStep("generating");

      // Get song recommendations from LLM service
      const recommendations = await api.getSongRecommendations(moodOrPrompt);
      console.log(`Recommendations: ${JSON.stringify(recommendations)}`);
      setCurrentStep("fetching");

      const response = await api.generatePlaylist(recommendations);
      setSongs(response.data || []);
      setCurrentStep("complete");
    } catch (err) {
      setError("Failed to generate playlist. Please try again.");
      console.error("Error generating playlist:", err);
      setCurrentStep("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (mood: Mood) => {
    setPlaylistCreationStatus("idle");
    setPlaylistUrl(null);
    setPlaylistError(null);

    setCurrentMood(mood);
    setCustomPrompt("");
    setCurrentStep("idle");
    await generatePlaylist(mood);
  };

  const handleCustomPrompt = async (prompt: string) => {
    // Reset playlist creation state when using a custom prompt
    setPlaylistCreationStatus("idle");
    setPlaylistUrl(null);
    setPlaylistError(null);
    // Clear the predefined mood when using a custom prompt
    setCurrentMood(null); 

    setCustomPrompt(prompt);
    await generatePlaylist(prompt);
  };

  const moodOrPrompt = customPrompt || currentMood;

  const handleCreateSpotifyPlaylist = async () => {
    if (songs.length === 0) {
      setPlaylistError("No songs generated yet.");
      return;
    }

    // Simple playlist name generation, could be improved
    const playlistName = currentMood
      ? `${currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood Playlist`
      : customPrompt
      ? `${customPrompt.substring(0, 20)}:: Playlist`
      : "My Mood Playlist";

    setPlaylistCreationStatus("creating");
    setPlaylistError(null);
    setPlaylistUrl(null);

    try {
      // Assumes user token is handled by the api service interceptor
      const result = await api.createSpotifyPlaylist(playlistName, songs);

      if (result.success && result.data) {
        setPlaylistUrl(result.data.playlistUrl);
        setPlaylistCreationStatus("success");
      } else {
        setPlaylistError(result.error || "Failed to create playlist.");
        setPlaylistCreationStatus("error");
      }
    } catch (err) {
      console.error("Error calling createSpotifyPlaylist:", err);
      setPlaylistError("An unexpected error occurred while creating the playlist.");
      setPlaylistCreationStatus("error");
    }
  };

  return (
    <div className="playlist-generator">
      <Header currentMood={currentMood} customPrompt={customPrompt} />
      <div className="content">
        <MoodSelector
          onMoodSelect={handleMoodSelect}
          onCustomPrompt={handleCustomPrompt}
          isLoading={isLoading}
        />

        {isLoading && (
          <ProgressBar
            currentStep={getCurrentStepNumber()}
            totalSteps={2}
            stepLabels={stepLabels}
          />
        )}

        {error && <div className="error-message">{error}</div>}

        {songs.length > 0 && (
          <div className="songs-container">
            <h2>Recommended Songs</h2>
            <div className="songs-grid">
              {songs
                .filter((song) => song.url !== null)
                .map((song, index) => (
                  <div key={index} className="song-card">
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                    <a
                      href={song.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotify-link"
                    >
                      Listen on Spotify
                    </a>
                  </div>
                ))}
            </div>
            {/* Buttons Container */}
            <div className="playlist-actions">
              <button
                className="regenerate-button"
                onClick={() => {
                  setCurrentStep("idle");
                  setPlaylistUrl(null); // Reset playlist URL on regenerate
                  setPlaylistError(null);
                  setPlaylistCreationStatus("idle");
                  if (customPrompt) {
                    handleCustomPrompt(customPrompt);
                  } else if (currentMood) {
                    generatePlaylist(currentMood);
                  }
                }}
                disabled={isLoading || playlistCreationStatus === "creating"}
              >
                {isLoading ? "Generating..." : "Regenerate Songs"}
              </button>
              <button
                className="regenerate-button create-playlist-button"
                onClick={handleCreateSpotifyPlaylist}
                disabled={isLoading || playlistCreationStatus === "creating" || songs.length === 0}
                // Could add disabled={!isLoggedIn} if login status is tracked
              >
                {playlistCreationStatus === "creating" ? "Creating..." : "Create Spotify Playlist"}
              </button>
            </div>

            {/* Playlist Creation Result */}
            {playlistCreationStatus === "success" && playlistUrl && (
              <div className="playlist-success">
                Playlist created successfully!{" "}
                <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
                  Open Playlist
                </a>
              </div>
            )}
            {playlistCreationStatus === "error" && playlistError && (
              <div className="error-message">{playlistError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};