import { Button, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface ActionButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 120
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        {...props}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.text.primary,
          fontWeight: "bold",
          padding: (theme) => theme.spacing(1.5, 3),
          borderRadius: "30px",
          textTransform: "none",
          fontSize: "1rem",
          boxShadow: "0px 6px 15px rgba(241, 81, 86, 0.25)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#e13e43",
            boxShadow: "0px 8px 20px rgba(241, 81, 86, 0.35)",
          },
          "&:disabled": {
            backgroundColor: (theme) => theme.palette.grey[800],
          },
          ...props.sx
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};
