// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Button, Link, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface LinkButtonProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ 
  children, 
  href,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        component={Link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        {...props}
        sx={{
          fontWeight: "bold",
          borderRadius: "24px",
          textTransform: "none",
          fontSize: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          backdropFilter: "blur(10px)",
          padding: "8px 16px",
          transition: "all 0.3s ease",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          ...props.sx
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};
