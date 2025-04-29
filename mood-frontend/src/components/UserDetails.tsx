import { Box, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext.tsx";

export function UserDetails() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Box display="flex">
      <Box textAlign="end">
        <Typography variant="body1">{user.name}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {user.email}
        </Typography>
      </Box>
      <IconButton onClick={logout}>
        <LogoutIcon />
      </IconButton>
    </Box>
  );
}
