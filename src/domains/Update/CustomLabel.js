// MUI
import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { styled } from "@mui/system";

const StyledCircleIcon = styled(CircleIcon, {
  name: "CustomLabel",
  slot: "icon",
})(({ theme }) => ({
  fontSize: "0.70rem",
  color: theme.palette.secondary.dark,
  paddingLeft: "2px",
  transition: "visibility 0s, opacity 0.3s linear",
}));

const CustomLabel = ({ label, isDirty }) => {
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

      <StyledCircleIcon
        sx={{
          visibility: isDirty ? "visibile" : "hidden",
          opacity: isDirty ? 1 : 0,
        }}
      />
    </Box>
  );
};

export default CustomLabel;
