import { useState, useEffect } from "react";
import { api, Song } from "../services/api.ts";
import { MoodSelector } from "../components/MoodSelector.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import "../styles/PlaylistGenerator.css";
import { Mood } from "../components/moods.ts";
<<<<<<< HEAD
import { Box, Typography, IconButton, Tooltip, Modal, Backdrop } from "@mui/material";
import { LinkButton } from "../components/buttons/LinkButton.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";
import { motion, AnimatePresence } from "framer-motion";
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
=======
import { Box, Typography, Button, Card, CardContent, Container, Grid, CircularProgress } from "@mui/material";
import { LinkButton } from "../components/buttons/LinkButton.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import DeleteIcon from '@mui/icons-material/Delete';
>>>>>>> c1b99dd (Implement playlist management features with MongoDB integration)

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
      setSongs([]);
      setCurrentStep("generating");

      // Get song recommendations from LLM service
      const recommendations = await api.getSongRecommendations(moodOrPrompt);
      console.log(`Recommendations: ${JSON.stringify(recommendations)}`);
      setCurrentStep("fetching");

      const response = await api.generatePlaylist(recommendations);
      console.log(`Spotify search response: ${JSON.stringify(response)}`);
      
      if (response && response.songs && Array.isArray(response.songs)) {
        setSongs(response.songs);
        console.log(`Setting songs state with ${response.songs.length} songs`);
      } else {
        console.error("Invalid response format from generatePlaylist:", response);
        setError("Received invalid response format from the server.");
      }
      
      setCurrentStep("complete");
    } catch (err) {
      setError("Failed to generate playlist. Please try again.");
      console.error("Error generating playlist:", err);
      setCurrentStep("idle");
      setSongs([]);
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

<<<<<<< HEAD
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
        stiffness: 300,
        damping: 20,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
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
=======
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
>>>>>>> c1b99dd (Implement playlist management features with MongoDB integration)
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

        <AnimatePresence mode="wait">
          {songs.length > 0 && (
            <Box 
              component={motion.div}
              textAlign="center" 
              mt={1}
              width="100%"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  mb: 2
                }}
              >
                <motion.div variants={titleVariants} initial="visible" animate="visible">
                  <Typography 
                    variant="h4" 
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
                
                <div className="action-icons" style={{ display: 'flex', gap: '1rem' }}>
                  <Tooltip title="Regenerate Playlist" arrow placement="top">
                    <span>
                      <IconButton
                        onClick={async () => {
                          setCurrentStep("idle");
                          setSongs([]);
                          if (moodOrPrompt) {
                            await generatePlaylist(moodOrPrompt);
                          }
                        }}
                        disabled={isLoading || !moodOrPrompt}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          padding: '10px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title="Create Spotify Playlist" arrow placement="top">
                    <span>
                      <IconButton
                        onClick={handleCreateSpotifyPlaylist}
                        disabled={isLoading || playlistCreationStatus === "creating" || songs.length === 0}
                        sx={{
                          backgroundColor: 'rgba(29, 185, 84, 0.2)',
                          color: '#1db954',
                          padding: '10px',
                          '&:hover': {
                            backgroundColor: 'rgba(29, 185, 84, 0.3)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(29, 185, 84, 0.3)',
                          }
                        }}
                      >
                        <PlaylistAddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </Box>
              
              <div 
                className="songs-grid"
                style={{ opacity: 1 }}
              >
                {songs && songs.length > 0 ? (
                  songs
                    .filter((song) => song && song.url !== null)
                    .map((song, index) => (
                      <div 
                        key={index}
                        className="song-card"
                        style={{ 
                          opacity: 1, 
                          transform: "none",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <div className="song-info">
                          <h3>{song.title}</h3>
                          <p>{song.artist}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                          <Tooltip title="Listen on Spotify" arrow placement="top">
                            <IconButton 
                              href={song.url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                                color: '#1db954',
                                '&:hover': {
                                  backgroundColor: 'rgba(29, 185, 84, 0.3)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                              size="medium"
                            >
                              <MusicNoteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    ))
                ) : (
                  <Typography variant="body1">No songs found. Try regenerating the playlist.</Typography>
                )}
              </div>
<<<<<<< HEAD
              
              <AnimatePresence mode="wait">
                {playlistCreationStatus === "success" && playlistUrl && (
                  <Modal
                    open={true}
                    onClose={() => setPlaylistCreationStatus("idle")}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 15
                        }
                      }}
                      exit={{ 
                        scale: 0.8, 
                        opacity: 0,
                        transition: { duration: 0.2 }
                      }}
                      className="success-modal"
                    >
                      <motion.div 
                        className="success-icon"
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          transition: { 
                            delay: 0.2,
                            type: "spring", 
                            stiffness: 300, 
                            damping: 10
                          }
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 70, color: '#1db954' }} />
                      </motion.div>
                      
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          transition: { 
                            delay: 0.3,
                            type: "spring", 
                            stiffness: 200, 
                            damping: 10
                          }
                        }}
                      >
                        Playlist Created!
                      </motion.h2>
                      
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          transition: { 
                            delay: 0.4,
                            type: "spring", 
                            stiffness: 200, 
                            damping: 10
                          }
                        }}
                      >
                        Your Spotify playlist has been successfully created.
                      </motion.p>
                      
                      <motion.div 
                        className="modal-actions"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          transition: { 
                            delay: 0.5,
                            type: "spring", 
                            stiffness: 200, 
                            damping: 10
                          }
                        }}
                      >
                        <a 
                          href={playlistUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="spotify-link"
                        >
                          <span>Open in Spotify</span>
                          <OpenInNewIcon fontSize="small" />
                        </a>
                        
                        <button 
                          className="close-button"
                          onClick={() => setPlaylistCreationStatus("idle")}
                        >
                          Close
                        </button>
                      </motion.div>
                    </motion.div>
                  </Modal>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {playlistCreationStatus === "error" && playlistError && (
                  <motion.div 
                    className="error-message"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    {playlistError}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          )}
        </AnimatePresence>
      </motion.div>
=======
            )}
            {playlistCreationStatus === "error" && playlistError && (
              <div className="error-message">{playlistError}</div>
            )}
          </Box>
        )}

        {/* Saved Playlists Section */}
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" my={2} textAlign="center">
            Your Saved Playlists
          </Typography>
          {loadingSaved && <Box my={3}><CircularProgress /></Box>}
          {savedError && <Typography color="error">{savedError}</Typography>}
          {!loadingSaved && savedPlaylists.length === 0 && (
            <Box display="flex" flexDirection="column" alignItems="center" my={4}>
              <PlaylistAddCheckIcon sx={{ fontSize: 48, color: "grey.500" }} />
              <Typography color="text.secondary" mt={2}>
                You haven't saved any playlists yet.
              </Typography>
            </Box>
          )}
          <Grid container spacing={3} justifyContent="center">
            {savedPlaylists.map((playlist) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={playlist.id || playlist._id || playlist.playlist_url}>
                  <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: '#23232b', position: 'relative' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {playlist.playlist_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Saved on {new Date(playlist.created_at).toLocaleString()}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href={playlist.playlist_url}
                        target="_blank"
                        fullWidth
                        sx={{ mt: 1, bgcolor: '#19d16f', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#13b85a' } }}
                      >
                        Open Playlist
                      </Button>
                      <Button
                        onClick={() => handleDeletePlaylist(playlist.id || playlist._id)}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, color: '#ff4757', bgcolor: 'transparent', '&:hover': { bgcolor: 'rgba(255,71,87,0.1)' } }}
                      >
                        <DeleteIcon />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
>>>>>>> c1b99dd (Implement playlist management features with MongoDB integration)
    </div>
  );
};
