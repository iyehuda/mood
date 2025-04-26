import React from "react";
import { Button, Container, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAuthUrl } from "../services/spotifyAuth";
import moodLogo from "../assets/mood.svg";
import spotifyLogo from "../assets/spotify.svg";

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

const SpotifyButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1DB954", // Spotify green
  color: "white",
  fontWeight: "bold",
  padding: theme.spacing(1.5, 3),
  borderRadius: "30px",
  marginTop: theme.spacing(3),
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#1AA34A",
  },
}));

const Logo = styled("img")({
  width: "180px",
  marginBottom: "24px",
});

const SmallLogo = styled("img")({
  margin: "0 0 0 8px",
  width: "28px",
});

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
      <Logo src={moodLogo} alt="Mood Logo" />
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Mood
        </Typography>
        <Typography variant="body1" align="center">
          Generate playlists based on your mood and preferences. Connect with your Spotify account
          to get started.
        </Typography>
        <SpotifyButton variant="contained" size="large" onClick={handleSpotifyLogin}>
          Connect with Spotify <SmallLogo src={spotifyLogo} alt="Spotify Logo" />
        </SpotifyButton>
      </StyledPaper>
    </Container>
  );
};
