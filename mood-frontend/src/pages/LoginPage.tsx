import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAuthUrl } from "../services/spotifyAuth";
import MoodLogo from "../components/logos/MoodLogo.tsx";
import { SpotifyLogo } from "../components/logos/SpotifyLogo.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "500px",
  margin: "0 auto",
  marginTop: theme.spacing(8),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

export const LoginPage: React.FC = () => {
  const handleSpotifyLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MoodLogo />
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Mood
        </Typography>
        <Typography variant="body1" align="center">
          Generate playlists based on your mood and preferences. Connect with your Spotify account
          to get started.
        </Typography>
        <ActionButton onClick={handleSpotifyLogin} sx={{ mt: 3 }}>
          Connect with Spotify <SpotifyLogo />
        </ActionButton>
      </StyledPaper>
    </Container>
  );
};
