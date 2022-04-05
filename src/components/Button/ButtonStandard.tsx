import * as React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

interface ButtonStandardProps {
  children: React.ReactNode;
  secondary: boolean;
}

/* Styling */
interface StyledFlags {
  secondary: boolean;
}

const StyledButton = styled(Button, {
  name: "ButtonStandard",
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "secondary",
})<StyledFlags>(({ secondary, theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.light,

  ...(secondary && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,

    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));

/**
 *
 * @param {bool} secondary If true, button will have a "secondary" style which is less prominent
 * @returns A custom styled MUI Button
 */
const ButtonStandard = (
  props: ButtonStandardProps & React.ComponentPropsWithoutRef<typeof Button>,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { children, secondary = false, ...rest } = props;
  return (
    <StyledButton
      variant="contained"
      size="small"
      disableElevation={secondary}
      secondary={secondary}
      ref={ref}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};
export default React.forwardRef(ButtonStandard);
