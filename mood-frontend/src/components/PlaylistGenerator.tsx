import { useState } from "react";
import { api, type Mood, Song } from "../services/api";
import { MoodSelector } from "./MoodSelector";
import { ProgressBar } from "./ProgressBar";
import { Header } from "./Header";
import "../styles/PlaylistGenerator.css";

type Step = "idle" | "generating" | "fetching" | "complete";

export const PlaylistGenerator = () => {
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

  const generatePlaylist = async (mood: Mood) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentStep("generating");

      // Get song recommendations from LLM service
      const recommendations = await api.getSongRecommendations(mood);

      setCurrentStep("fetching");
      // Generate playlist using backend service
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

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    setCustomPrompt("");
    setCurrentStep("idle");
    generatePlaylist(mood);
  };

  const handleCustomPrompt = async (prompt: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentStep("generating");
      setCustomPrompt(prompt);

      // Get song recommendations from LLM service with custom prompt
      const recommendations = await api.getSongRecommendations(prompt);

      setCurrentStep("fetching");
      // Generate playlist using backend service
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
            <button
              className="regenerate-button"
              onClick={() => {
                setCurrentStep("idle");
                if (currentMood) {
                  generatePlaylist(currentMood);
                }
              }}
              disabled={isLoading || !currentMood}
            >
              {isLoading ? "Generating..." : "Regenerate Playlist"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
