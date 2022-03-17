import { memo, forwardRef, useRef } from "react";

// MUI
import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import { styled } from "@mui/system";

// Components
import CustomLabel from "./CustomLabel";

/* Styling */
const StyledInput = styled(OutlinedInput, {
  name: "EditorTextField",
  slot: "Input",
})(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "3px",

  "& .MuiOutlinedInput-input": {
    padding: "4px 4px 5px 8px",
  },

  //multiline
  "&.MuiInputBase-multiline": {
    padding: "6px 0px 0px 4px",
  },
}));

const StyledInputLabel = styled("label", {
  name: "EditorTextField",
  slot: "InputLabel",
})(({ theme }) => ({}));

const EditorTextField = forwardRef(
  (
    {
      inputSize = 20,
      isDirty,
      label,
      InputLabelProps,
      InputProps,
      inputProps,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl sx={{ width: props.fullWidth && "100%" }}>
        <StyledInputLabel
          htmlFor={`editorTextField-${label}`}
          {...InputLabelProps}
        >
          <CustomLabel label={label} isDirty={isDirty} />
        </StyledInputLabel>
        <StyledInput
          id={`editorTextField-${label}`}
          inputProps={{
            ...inputProps,
            size: inputSize,
          }}
          {...InputProps}
          {...props}
          inputRef={ref}
        />
        <FormHelperText id="editorTextField-helperText"></FormHelperText>
      </FormControl>
    );
  }
);

export default memo(EditorTextField);
