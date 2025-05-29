import { useState, useEffect } from "react";
import { api, Song } from "../services/api.ts";
import { MoodSelector } from "../components/MoodSelector.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import "../styles/PlaylistGenerator.css";
import { Mood } from "../components/moods.ts";
import { Box, Typography, IconButton, Tooltip, Modal, Backdrop, Container, Grid, Button } from "@mui/material";
import { LinkButton } from "../components/buttons/LinkButton.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";
import { motion, AnimatePresence } from "framer-motion";
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';

type Step = "idle" | "generating" | "fetching" | "complete";
type PlaylistCreationStatus = "idle" | "creating" | "success" | "error";

interface SavedPlaylist {
  _id?: string;
  user_id: string;
  playlist_name: string;
  playlist_url: string;
  created_at: string;
}

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
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [savedError, setSavedError] = useState<string | null>(null);

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
      // Save to backend DB and update local list
      try {
        const saved = await api.savePlaylist(playlistName, playlistUrl);
        setSavedPlaylists((prev) => [saved, ...prev]);
      } catch (err) {
        console.error("Failed to save playlist to DB", err);
      }
    } catch (err) {
      console.error("Error calling createSpotifyPlaylist:", err);
      setPlaylistError("An unexpected error occurred while creating the playlist.");
      setPlaylistCreationStatus("error");
    }
  };

  useEffect(() => {
    const fetchSaved = async () => {
      setLoadingSaved(true);
      setSavedError(null);
      try {
        const data = await api.getSavedPlaylists();
        setSavedPlaylists(data);
      } catch (err) {
        setSavedError("Failed to load saved playlists.");
      } finally {
        setLoadingSaved(false);
      }
    };
    fetchSaved();
  }, []);

  // Delete a saved playlist
  const handleDeletePlaylist = async (playlistId: string | undefined) => {
    if (!playlistId) return;
    try {
      await api.deleteSavedPlaylist(playlistId);
      setSavedPlaylists((prev) => prev.filter((p) => p._id !== playlistId && p._id !== playlistId));
    } catch (err) {
      // Optionally show an error message
      console.error('Failed to delete playlist', err);
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
      {/* Saved Playlists Section */}
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing={1}
            sx={{
              display: 'inline-block',
              position: 'relative',
              color: '#fff',
            }}
          >
            Your Saved Playlists
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -6,
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #19d16f, #13b85a 80%)',
                width: '100%',
                mx: 'auto',
              }}
            />
          </Typography>
        </Box>
        {loadingSaved && <Box my={6} display="flex" justifyContent="center"><span className="loader" /></Box>}
        {savedError && <Typography color="error" textAlign="center" my={3}>{savedError}</Typography>}
        {!loadingSaved && savedPlaylists.length === 0 && !savedError && (
          <Box display="flex" flexDirection="column" alignItems="center" my={8}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <MusicNoteIcon sx={{ fontSize: 72, color: 'grey.500' }} />
            </motion.div>
            <Typography color="text.secondary" mt={3} fontSize={20}>
              You haven't saved any playlists yet.
            </Typography>
          </Box>
        )}
        <div className="saved-playlists-grid">
          {savedPlaylists.map((playlist) => (
            <div key={playlist._id || playlist.playlist_url} className="song-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div className="song-info">
                <h3 style={{ marginBottom: 8 }}>{playlist.playlist_name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: 0 }}>
                  Saved on {new Date(playlist.created_at).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 'auto', width: '100%' }}>
                <Button
                  href={playlist.playlist_url}
                  target="_blank"
                  sx={{
                    bgcolor: '#19d16f',
                    color: '#fff',
                    fontWeight: 700,
                    flex: 1,
                    borderRadius: '30px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0px 6px 15px rgba(25,209,111,0.15)',
                    transition: 'all 0.3s',
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: '#13b85a', boxShadow: '0px 8px 20px rgba(25,209,111,0.25)' }
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 20, mr: 1 }} />
                  Open
                </Button>
                <Button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  size="small"
                  sx={{
                    color: '#ff4757',
                    bgcolor: 'rgba(255,71,87,0.08)',
                    borderRadius: '30px',
                    fontWeight: 700,
                    flex: 1,
                    height: 44,
                    px: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255,71,87,0.18)',
                      boxShadow: '0px 4px 16px rgba(255,71,87,0.18)'
                    }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 20, mr: 1 }} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
