import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const MoodButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 3),
  borderRadius: "24px",
  textTransform: "capitalize",
  fontSize: "0.8rem",
  size: "small",
  fontWeight: "500",
  minWidth: "100px",
}));
