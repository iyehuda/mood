import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useAuth } from "../context/useAuth.tsx";

export const CallbackPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // After token has been processed by AuthContext, redirect to main app
    if (isAuthenticated) {
      // Small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Logging you in...
      </Typography>
    </Box>
  );
};
