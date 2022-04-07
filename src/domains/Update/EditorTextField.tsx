import * as React from "react";

// MUI
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputLabelProps as MuiInputLabelProps,
  InputProps as MuiInputProps,
  OutlinedInputProps,
} from "@mui/material";

import { styled } from "@mui/material/styles";

// Components
import CustomLabel from "./CustomLabel";

// Types
import { FieldError } from "react-hook-form";

interface EditorTextFieldProps extends OutlinedInputProps {
  isDirty: boolean;
  fieldError: FieldError | undefined;
  label?: string;
  InputLabelProps?: MuiInputLabelProps;
  InputProps?: MuiInputProps;
  inputProps?: Record<string, unknown>;
  width?: number;
  multiline?: boolean;
}

/* Styling */
const StyledInput = styled(OutlinedInput, {
  name: "EditorTextField",
  slot: "Input",
})(() => ({
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
})(() => ({}));

const EditorTextField = (
  props: EditorTextFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const {
    isDirty,
    fieldError,
    label,
    InputLabelProps,
    InputProps,
    inputProps,
    width,
    multiline,
    ...rest
  } = props;
  return (
    <FormControl sx={{ width: `${width}%` || "auto" }}>
      <StyledInputLabel
        htmlFor={`editorTextField-${label}`}
        {...InputLabelProps}
      >
        <CustomLabel
          label={label}
          isDirty={isDirty}
          error={Boolean(fieldError)}
        />
      </StyledInputLabel>
      <StyledInput
        id={`editorTextField-${label}`}
        inputProps={{
          ...inputProps,
          ...(multiline && {
            style: {
              resize: "vertical",
              height: "auto",
              minHeight: "4rem",
              maxHeight: "24rem",
            },
          }),
        }}
        {...InputProps}
        {...rest}
        inputRef={ref}
      />
      <FormHelperText
        id="editorTextField-helperText"
        error
        required
        margin="dense"
        component="span"
        sx={{ ml: 0 }}
      >
        {fieldError?.message || " "}
      </FormHelperText>
    </FormControl>
  );
};

export default React.memo(React.forwardRef(EditorTextField));
