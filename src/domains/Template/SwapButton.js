import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const SwapButton = (props) => {
  return (
    <CompareArrowsIcon
      {...props}
      sx={{
        cursor: "pointer",
        "&:hover": {
          color: "primary.main",
        },
      }}
    />
  );
};

export default SwapButton;
