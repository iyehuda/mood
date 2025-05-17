import React, { useState } from "react";
import "../styles/MoodSelector.css";
import { ActionButton } from "./buttons/ActionButton.tsx";
import { MoodButton } from "./buttons/MoodButton.tsx";
import { Mood, moodColors } from "./moods.ts";
import Grid from "@mui/material/Grid2";
import { motion } from "framer-motion";
import { Box, Typography, InputBase, Paper, IconButton } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  onCustomPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export const MoodSelector = ({
  onMoodSelect,
  onCustomPrompt,
  isLoading = false,
}: MoodSelectorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

  const handleMoodClick = (mood: Mood) => {
    onMoodSelect(mood);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onCustomPrompt(customPrompt.trim());
      setCustomPrompt("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" } 
    }
  };

  // Star icon animation variants
  const starIconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: [1, 1.2, 1.1],
      rotate: [0, 15, -15, 0],
      filter: "drop-shadow(0 0 8px rgba(241, 81, 86, 0.4))",
      transition: { 
        rotate: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.5,
          ease: "easeInOut" 
        },
        scale: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
          ease: "easeInOut"
        }
      }
    },
    tap: { scale: 0.9 },
    active: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      filter: "drop-shadow(0 0 12px rgba(241, 81, 86, 0.6))",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="mood-selector-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={titleVariants}
        className="mood-title-container"
      >
        <Typography 
          variant="h1" 
          className="title"
          sx={{ 
            fontSize: { xs: '3rem', md: '5rem' }, 
            fontWeight: 900,
            color: "#f15156",
            textAlign: "center",
            marginBottom: 1,
            letterSpacing: "-2px",
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          }}
        >
          Mood
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500, 
            color: "text.secondary",
            textAlign: "center",
            marginBottom: 4,
            maxWidth: "70%",
            margin: "0 auto 3rem auto",
          }}
        >
          Discover playlists that match your mood
        </Typography>
      </motion.div>

      <motion.div className="mood-buttons-container">
        <div className="mood-buttons-row">
          {Object.entries(moodColors).map(([mood, color], index) => (
            <MoodButton
              key={mood}
              sx={{ backgroundColor: color }}
              onClick={() => handleMoodClick(mood as Mood)}
              disabled={isLoading}
              delay={index}
            >
              {mood}
            </MoodButton>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="search-container"
      >
        <div className="sparkle-1"></div>
        <div className="sparkle-2"></div>
        
        {/* Decorative sparkle SVGs */}
        <motion.svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          style={{
            position: 'absolute',
            top: '-15px',
            right: '25%',
            zIndex: 1,
            color: 'rgba(241, 81, 86, 0.6)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.2, 0.6, 0.2], 
            scale: [0.8, 1, 0.8],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          <path d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z" fill="currentColor" />
        </motion.svg>
        
        <motion.svg 
          width="14" 
          height="14" 
          viewBox="0 0 20 20" 
          fill="none"
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '45%',
            zIndex: 1,
            color: 'rgba(241, 81, 86, 0.5)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.15, 0.4, 0.15], 
            scale: [0.6, 0.9, 0.6],
            rotate: [0, -20, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <path d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z" fill="currentColor" />
        </motion.svg>
        
        <Paper
          component="form"
          onSubmit={handleCustomPromptSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            borderRadius: 50,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <InputBase
            sx={{
              ml: 2,
              flex: 1,
              color: 'white',
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.6)',
                opacity: 1,
              },
              padding: '10px 5px',
              fontSize: '1.1rem',
            }}
            placeholder="what's your mood?"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isLoading}
            inputProps={{ 'aria-label': 'search' }}
          />
          <motion.div
            variants={starIconVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            animate={isLoading ? "active" : "initial"}
            className="star-icon-container"
          >
            <IconButton 
              type="submit" 
              sx={{ 
                p: '10px',
                color: '#f15156',
                '&:hover': {
                  backgroundColor: 'rgba(241, 81, 86, 0.05)'
                },
                position: 'relative',
                overflow: 'visible'
              }}
              aria-label="search"
              disabled={isLoading || !customPrompt.trim()}
            >
              <AutoAwesomeIcon 
                sx={{ 
                  fontSize: '1.5rem',
                  filter: 'drop-shadow(0 0 4px rgba(241, 81, 86, 0.25))'
                }} 
              />
              <motion.div 
                className="sparkle-effect"
                initial={{ opacity: 0, scale: 0 }}
                animate={isLoading ? { 
                  opacity: [0, 0.5, 0], 
                  scale: [0.5, 1.5, 0.5],
                  rotate: [0, 180, 360]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  background: 'radial-gradient(circle, rgba(241,81,86,0.15) 0%, rgba(241,81,86,0) 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
            </IconButton>
          </motion.div>
        </Paper>
      </motion.div>
    </motion.div>
  );
};
