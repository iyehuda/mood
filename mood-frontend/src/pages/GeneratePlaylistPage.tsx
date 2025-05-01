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

export const GeneratePlaylistPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("idle");
  const [customPrompt, setCustomPrompt] = useState<string>("");

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

      const recommendations = await api.getSongRecommendations(moodOrPrompt);
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
    setCurrentMood(mood);
    setCustomPrompt("");
    setCurrentStep("idle");
    await generatePlaylist(mood);
  };

  const handleCustomPrompt = async (prompt: string) => {
    setCustomPrompt(prompt);
    await generatePlaylist(prompt);
  };

  const moodOrPrompt = customPrompt || currentMood;

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
          </Box>
        )}
      </div>
    </div>
  );
};
