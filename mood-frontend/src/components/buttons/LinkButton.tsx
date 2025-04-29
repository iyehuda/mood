// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { styled } from "@mui/material/styles";
import { Button, Link } from "@mui/material";
import { ComponentProps } from "react";

const StyledLinkButton = styled(Button)(() => ({
  fontWeight: "bold",
  borderRadius: "24px",
  textTransform: "none",
  fontSize: "1rem",
}));

export function LinkButton(props: ComponentProps<typeof StyledLinkButton>) {
  return (
    <StyledLinkButton
      component={Link}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      {...props}
    />
  );
}
