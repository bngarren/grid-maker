import * as React from "react";

// MUI
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Zoom,
  FormHelperText,
  Fade,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

// Context
import useGridState from "../../../global/useGridState";

// Util
import { APP_TEXT } from "../../../utils";

/* Styling */

const StyledOutlinedInput = styled(OutlinedInput, {
  name: "AddNewGridDataElementForm",
  slot: "input",
})(() => ({}));

const AddNewGridDataObjectInput = () => {
  const { validateIndexElementValue, addNewGridDataObject } = useGridState();
  const [value, setValue] = React.useState<string>("");
  const [helperText, setHelperText] = React.useState<string>("");

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setValue(event.target.value);
    setHelperText("");
  };

  /**
   * Handles the submit action by calling useGridState's addNewGridDataObject function
   */
  const handleOnSubmit = () => {
    // Validate potential index Value
    const validation = validateIndexElementValue(value);

    if (!validation.status) {
      setHelperText(validation.message ?? "");
    } else {
      addNewGridDataObject(value);
      setValue("");
      setHelperText("");
    }
  };

  const handleOnKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      handleOnSubmit();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Fade in={helperText?.length > 0}>
        <FormHelperText error component="div" sx={{ px: 2 }}>
          {helperText}
        </FormHelperText>
      </Fade>

      <StyledOutlinedInput
        placeholder={APP_TEXT.addGridDataObject}
        size="small"
        value={value}
        onChange={handleOnChange}
        onKeyPress={handleOnKeyPress}
        inputProps={{
          size: 10,
        }}
        endAdornment={
          <Zoom in={value.trim() !== ""}>
            <InputAdornment position="end">
              <IconButton
                aria-label="add item"
                onClick={handleOnSubmit}
                size="large"
                sx={{
                  padding: "3px",
                }}
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          </Zoom>
        }
      />
    </Box>
  );
};

export default AddNewGridDataObjectInput;
