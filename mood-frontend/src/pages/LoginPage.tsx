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
  marginTop: theme.spacing(4),
  borderRadius: "16px",
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledPaper>
        <MoodLogo />
        <Typography variant="h6" align="center" gutterBottom my={3}>
          Generate playlists based on your mood and preferences
        </Typography>
        <ActionButton onClick={handleSpotifyLogin}>
          Connect with Spotify <SpotifyLogo />
        </ActionButton>
        <Typography variant="subtitle2" color="textSecondary" mt={2}>
          Connect with your Spotify account to get started
        </Typography>
      </StyledPaper>
    </Container>
  );
};
