import { UserDetails } from "./UserDetails.tsx";
import MoodLogo from "./logos/MoodLogo.tsx";
import { styled } from "@mui/material/styles";
import { getMoodColor, Mood } from "./moods.ts";
import { motion } from "framer-motion";
import { Typography, Box, useTheme } from "@mui/material";

interface ToolbarProps {
  currentMood: Mood | null;
  customPrompt: string;
}

const StyledHeader = styled("header")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  minHeight: "64px",
  backdropFilter: "blur(10px)",
  background: "rgba(18, 18, 18, 0.8)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
}));

const LogoContainer = styled(motion.div)({
  display: "flex",
  alignItems: "center",
});

const MoodContainer = styled(motion.div)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginLeft: "16px",
  minHeight: "38px",
});

const StyledMoodTitle = styled(motion.div)({
  fontSize: "1.2rem",
  fontWeight: "700",
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const StyledTitleUnderline = styled(motion.div)({
  marginTop: "4px",
  width: "100%",
  height: "3px",
  borderRadius: "2px",
});

export const Toolbar = ({ currentMood, customPrompt }: ToolbarProps) => {
  const theme = useTheme();
  const moodColor = getMoodColor((customPrompt as Mood) || currentMood);
  const title = customPrompt || currentMood;

  return (
    <StyledHeader>
      <Box sx={{ display: "flex", alignItems: "center", minHeight: "40px" }}>
        <LogoContainer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
        </LogoContainer>

        {title ? (
          <MoodContainer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledMoodTitle>
              <Typography
                component="span"
                sx={{
                  color: moodColor,
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.9rem",
                }}
              >
                mood
              </Typography>
            </StyledMoodTitle>
            <StyledTitleUnderline
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                background: `linear-gradient(90deg, ${moodColor}, ${moodColor}80)`,
              }}
            />
          </MoodContainer>
        ) : (
          <MoodContainer
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <Box sx={{ height: "28px", width: "120px" }} />
          </MoodContainer>
        )}
      </Box>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserDetails />
      </motion.div>
    </StyledHeader>
  );
};
