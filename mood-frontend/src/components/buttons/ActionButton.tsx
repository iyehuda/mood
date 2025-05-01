import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { themeColors } from "../../styles/theme.ts";

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  fontWeight: "bold",
  padding: theme.spacing(1.5, 3),
  borderRadius: "24px",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: themeColors.spotifyGreenHover,
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey["800"],
  },
  size: "large",
}));
