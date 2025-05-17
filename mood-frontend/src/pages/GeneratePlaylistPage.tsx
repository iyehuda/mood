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
import { motion, AnimatePresence } from "framer-motion";

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

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const songCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 12 
      }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="playlist-generator">
      <Toolbar currentMood={currentMood} customPrompt={customPrompt} />
      <motion.div 
        className="content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <MoodSelector
          onMoodSelect={handleMoodSelect}
          onCustomPrompt={handleCustomPrompt}
          isLoading={isLoading}
        />

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProgressBar
              currentStep={getCurrentStepNumber()}
              totalSteps={2}
              stepLabels={stepLabels}
            />
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div 
              className="error-message"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {songs.length > 0 && (
            <Box 
              component={motion.div}
              textAlign="center" 
              mt={2}
              width="100%"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={titleVariants}>
                <Typography 
                  variant="h4" 
                  my={2}
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))"
                  }}
                >
                  Recommended Songs
                </Typography>
              </motion.div>
              
              <motion.div 
                className="songs-grid"
                variants={containerVariants}
              >
                {songs
                  .filter((song) => song.url !== null)
                  .map((song, index) => (
                    <motion.div 
                      key={index}
                      className="song-card"
                      variants={songCardVariants}
                      custom={index}
                    >
                      <div className="song-info">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                      </div>
                      <LinkButton href={song.url!}>Listen on Spotify</LinkButton>
                    </motion.div>
                  ))}
              </motion.div>
              
              <motion.div 
                className="playlist-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
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
              </motion.div>

              <AnimatePresence>
                {playlistCreationStatus === "success" && playlistUrl && (
                  <motion.div 
                    className="playlist-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    Playlist created successfully!{" "}
                    <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
                      Open Playlist
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {playlistCreationStatus === "error" && playlistError && (
                  <motion.div 
                    className="error-message"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {playlistError}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
