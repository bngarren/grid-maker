import * as React from "react";

// MUI
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Zoom,
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
  const { addNewGridDataObject } = useGridState();
  const [value, setValue] = React.useState<string>("");

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setValue(event.target.value);
  };

  /**
   * Handles the submit action by calling useGridState's addNewGridDataObject function
   */
  const handleOnSubmit = () => {
    // Validate potential index Value
    // TODO

    addNewGridDataObject(value);
    setValue("");
  };

  const handleOnKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      handleOnSubmit();
    }
  };

  return (
    <Box>
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
