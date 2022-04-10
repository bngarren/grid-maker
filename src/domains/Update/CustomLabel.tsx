// MUI
import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { styled } from "@mui/material/styles";

interface CustomLabelProps {
  label: string | undefined;
  isDirty: boolean;
  error: boolean;
}

const StyledCircleIcon = styled(CircleIcon, {
  name: "CustomLabel",
  slot: "icon",
  shouldForwardProp: (prop) => prop !== "styleError" && prop !== "isDirty",
})<{ styleError: boolean; isDirty: boolean }>(
  ({ styleError, isDirty, theme }) => ({
    fontSize: "0.70rem",
    color: theme.palette.secondary.dark,
    paddingLeft: "2px",
    transition: "visibility 0s, opacity 0.3s linear",
    visibility: "hidden",
    opacity: 0,
    ...(styleError && {
      color: theme.palette.error.main,
    }),
    ...(isDirty && {
      visibility: "visible",
      opacity: 1,
    }),
  })
);

const CustomLabel = ({ label, isDirty, error }: CustomLabelProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: isDirty ? "primary.light" : "grey.700",
          fontSize: "0.85rem",
          fontWeight: "bold",
        }}
      >
        {label}
      </Typography>

      <StyledCircleIcon styleError={error} isDirty={isDirty} />
    </Box>
  );
};

export default CustomLabel;
