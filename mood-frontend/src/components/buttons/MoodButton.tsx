import { Button, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface MoodButtonProps extends ButtonProps {
  children: React.ReactNode;
  delay?: number;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ 
  children, 
  delay = 0, 
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 120
      }}
      whileHover={{ 
        scale: 1.08,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        {...props}
        sx={{
          color: (theme) => theme.palette.text.primary,
          padding: (theme) => theme.spacing(1.5, 3),
          borderRadius: "24px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: "600",
          minWidth: "110px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          width: "100%",
          height: "100%",
          ...props.sx
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};
