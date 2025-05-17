import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAuthUrl } from "../services/spotifyAuth";
import { SpotifyLogo } from "../components/logos/SpotifyLogo.tsx";
import { ActionButton } from "../components/buttons/ActionButton.tsx";
import { motion } from "framer-motion";
import { moodColors, Mood } from "../components/moods";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "500px",
  marginTop: theme.spacing(4),
  borderRadius: "16px",
  background: "rgba(24, 24, 24, 0.8)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  position: "relative",
  overflow: "hidden",
  zIndex: 10,
}));

const BackgroundGradient = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(135deg, #121212 0%, #222222 100%)",
  zIndex: -2,
});

const GlowEffect = styled(Box)({
  position: "absolute",
  width: "80vw",
  height: "80vh",
  borderRadius: "50%",
  filter: "blur(100px)",
  opacity: 0.15,
  background: "radial-gradient(circle, #f15156 0%, transparent 70%)",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: -1,
});

const StyledLogo = styled(Typography)(({ theme }) => ({
  fontSize: '6rem',
  fontWeight: 800,
  color: '#e15156',
  letterSpacing: '-0.025em',
  textAlign: 'center',
  textTransform: 'none',
  marginBottom: theme.spacing(2),
  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
  fontFamily: "'Gotham', 'Circular', 'Helvetica Neue', 'Arial', sans-serif",
  textDecoration: 'none',
  position: 'relative',
  paddingBottom: '10px',
}));

// Create floating mood bubbles
const MoodBubble = ({ mood, size, delay }: { mood: Mood, size: number, delay: number }) => {
  const randomPath = {
    x: [
      Math.random() * 30 - 15,
      Math.random() * 60 - 30,
      Math.random() * 30 - 15
    ],
    y: [
      Math.random() * 30 - 15,
      Math.random() * 60 - 30,
      Math.random() * 30 - 15
    ]
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        background: moodColors[mood],
        borderRadius: "50%",
        width: size,
        height: size,
        filter: `blur(${size/10}px)`,
        opacity: 0.7,
        zIndex: 1
      }}
      animate={{
        ...randomPath,
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export const LoginPage: React.FC = () => {
  const handleSpotifyLogin = () => {
    window.location.href = getAuthUrl();
  };

  // Generate positions for the mood bubbles
  const generateBubblePosition = () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  // Create an array of mood bubbles with random positions and sizes
  const moodBubbles = Object.keys(moodColors).map((mood, index) => {
    const position = generateBubblePosition();
    const size = 20 + Math.random() * 60; // Random size between 20px and 80px
    const delay = index * 0.5; // Stagger the animations
    
    return (
      <Box
        key={mood}
        sx={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 1,
        }}
      >
        <MoodBubble mood={mood as Mood} size={size} delay={delay} />
      </Box>
    );
  });

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundGradient />
      <GlowEffect />
      
      {/* Mood bubbles floating in the background */}
      {moodBubbles}
      
      <StyledPaper>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -10, 0],
              filter: ['drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))', 'drop-shadow(0 8px 20px rgba(225, 81, 86, 0.4))', 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))']
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
          >
            <StyledLogo variant="h1">Mood</StyledLogo>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography variant="h6" align="center" gutterBottom my={3}>
            Generate playlists based on your mood and preferences
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 } 
          }}
        >
          <ActionButton onClick={handleSpotifyLogin}>
            Connect with Spotify <SpotifyLogo />
          </ActionButton>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Typography variant="subtitle2" color="textSecondary" mt={2}>
            Connect with your Spotify account to get started
          </Typography>
        </motion.div>
      </StyledPaper>
      
      {/* Decorative elements */}
      <motion.svg 
        width="30" 
        height="30" 
        viewBox="0 0 20 20" 
        fill="none"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '20%',
          zIndex: 1,
          color: 'rgba(241, 81, 86, 0.8)'
        }}
        animate={{ 
          opacity: [0.4, 0.8, 0.4], 
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z" fill="currentColor" />
      </motion.svg>
      
      <motion.svg 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none"
        style={{
          position: 'absolute',
          top: '15%',
          left: '25%',
          zIndex: 1,
          color: 'rgba(255, 215, 0, 0.7)' // happy mood color
        }}
        animate={{ 
          opacity: [0.3, 0.7, 0.3], 
          scale: [0.7, 1, 0.7],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <path d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z" fill="currentColor" />
      </motion.svg>
    </Container>
  );
};
