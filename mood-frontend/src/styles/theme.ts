import { createTheme } from "@mui/material/styles";

export const themeColors = {
  spotifyGreen: "#1DB954",
  spotifyGreenHover: "#1AA34A",
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: themeColors.spotifyGreen,
    },
  },
});
