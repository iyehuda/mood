import { Box, IconButton, Avatar, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth.tsx";

export function UserDetails() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box 
      component={motion.div}
      display="flex" 
      alignItems="center"
      gap={2}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        component={motion.div}
        textAlign="end"
        whileHover={{ scale: 1.05 }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            fontSize: "0.95rem",
            letterSpacing: "-0.02em"
          }}
        >
          {user.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontSize: "0.8rem"
          }}
        >
          {user.email}
        </Typography>
      </Box>
      
      <Avatar 
        component={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        sx={{ 
          bgcolor: "#f15156", 
          width: 36, 
          height: 36,
          fontSize: "0.9rem",
          fontWeight: 700,
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
        }}
      >
        {getInitials(user.name)}
      </Avatar>
      
      <Tooltip title="Logout">
        <IconButton 
          component={motion.button}
          onClick={logout}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          sx={{ 
            color: "text.secondary",
            "&:hover": { 
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)" 
            }
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
