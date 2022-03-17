import { useState, useEffect } from "react";

// MUI
import { InputAdornment, IconButton, Fade, TextField } from "@mui/material";
import { styled } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";

/* Styling */

const StyledTextField = styled(TextField, {
  name: "QuickAddInput",
  slot: "textfield",
})(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "8px 0px 4px 8px",
    "&.Mui-focused fieldset": {
      borderWidth: "0.1em",
      borderColor: theme.palette.primary.main,
      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    // the input element
    fontSize: theme.typography.formFontSizeLevel2,
    padding: 0,
  },
}));

const QuickAddInput = ({ onSubmit = (f) => f, reset, ...props }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSubmit(value || null);
    setValue("");
  };

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* Use the reset prop to know when the input should clear,
  E.g., a new section has been selected */
  useEffect(() => {
    setValue("");
  }, [reset]);

  return (
    <div>
      <StyledTextField
        value={value}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        placeholder="Add section"
        size="small"
        inputProps={{
          size: "15",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Fade in={value !== null && value !== ""}>
                <IconButton
                  onClick={handleSubmit}
                  sx={{
                    p: "1.5px",
                    color: "gray.100",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  size="large"
                >
                  <AddBoxIcon
                    sx={{
                      padding: 0.3,
                      color: "primary.light",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  />
                </IconButton>
              </Fade>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </div>
  );
};

export default QuickAddInput;
