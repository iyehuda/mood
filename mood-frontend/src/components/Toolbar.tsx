import { UserDetails } from "./UserDetails.tsx";
import MoodLogo from "./logos/MoodLogo.tsx";
import { styled } from "@mui/material/styles";
import { getMoodColor, Mood } from "./moods.ts";

interface ToolbarProps {
  currentMood: Mood | null;
  customPrompt: string;
}

const StyledHeader = styled("header")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
}));

const StyledTitle = styled("div")({
  display: "flex",
  alignItems: "center",
  position: "relative",
  flexDirection: "column",
});

const StyledMoodTitle = styled("div")({
  fontSize: "1.5rem",
  fontWeight: "600",
  textTransform: "capitalize",
});

const StyledTitleUnderline = styled("div")({
  bottom: "-4px",
  width: "100%",
  height: "4px",
  borderRadius: "2px",
});

export const Toolbar = ({ currentMood, customPrompt }: ToolbarProps) => {
  const moodColor = getMoodColor((customPrompt as Mood) || currentMood);

  const title = customPrompt || currentMood;

  return (
    <StyledHeader>
      <StyledTitle>
        <MoodLogo />

        {title ? (
          <>
            <StyledMoodTitle>{title}</StyledMoodTitle>
            <StyledTitleUnderline
              style={{
                background: `linear-gradient(90deg, ${moodColor}, ${moodColor}80)`,
              }}
            ></StyledTitleUnderline>
          </>
        ) : null}
      </StyledTitle>
      <UserDetails />
    </StyledHeader>
  );
};
