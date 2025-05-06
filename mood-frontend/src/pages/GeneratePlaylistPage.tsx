import { useState } from "react";
import { api, Song } from "../services/api.ts";
import { MoodSelector } from "../components/MoodSelector.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import "../styles/PlaylistGenerator.css";
import { Mood } from "../components/moods.ts";
import { Box, Typography } from "@mui/material";
import { LinkButton } from "../components/buttons/LinkButton.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";

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

      const { songs } = await api.generatePlaylist(recommendations);
      setSongs(songs);
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
    setPlaylistCreationStatus("idle");
    setPlaylistUrl(null);
    setPlaylistError(null);
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

    const playlistName = currentMood
      ? `${currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood Playlist`
      : customPrompt
        ? `${customPrompt.substring(0, 20)}:: Playlist`
        : "My Mood Playlist";

    setPlaylistCreationStatus("creating");
    setPlaylistError(null);
    setPlaylistUrl(null);

    try {
      const { playlistUrl } = await api.createSpotifyPlaylist(playlistName, songs);

      setPlaylistUrl(playlistUrl);
      setPlaylistCreationStatus("success");
    } catch (err) {
      console.error("Error calling createSpotifyPlaylist:", err);
      setPlaylistError("An unexpected error occurred while creating the playlist.");
      setPlaylistCreationStatus("error");
    }
  };

  return (
    <div className="playlist-generator">
      <Toolbar currentMood={currentMood} customPrompt={customPrompt} />
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
          <Box textAlign="center" mt={2}>
            <Typography variant="h4" my={2}>
              Recommended Songs
            </Typography>
            <div className="songs-grid">
              {songs
                .filter((song) => song.url !== null)
                .map((song, index) => (
                  <div key={index} className="song-card">
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                    <LinkButton href={song.url!}>Listen on Spotify</LinkButton>
                  </div>
                ))}
            </div>
            {/* Buttons Container */}
            <div className="playlist-actions">
              <ActionButton
                onClick={async () => {
                  setCurrentStep("idle");
                  if (moodOrPrompt) {
                    await generatePlaylist(moodOrPrompt);
                  }
                }}
                disabled={isLoading || !moodOrPrompt}
              >
                {isLoading ? "Generating..." : "Regenerate Playlist"}
              </ActionButton>
              <ActionButton
                onClick={handleCreateSpotifyPlaylist}
                disabled={isLoading || playlistCreationStatus === "creating" || songs.length === 0}
              >
                {playlistCreationStatus === "creating" ? "Creating..." : "Create Spotify Playlist"}
              </ActionButton>
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
          </Box>
        )}
      </div>
    </div>
  );
};
