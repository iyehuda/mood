import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useAuth } from "../context/useAuth.tsx";

export const CallbackPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 500);

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
      <Typography variant="h6" mt={2} color="textPrimary">
        Logging you in...
      </Typography>
    </Box>
  );
};
