import { useState } from "react";

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
import { useGridState } from "../../global/GridState";

// Util
import { APP_TEXT } from "../../utils";

/* Styling */

const StyledOutlinedInput = styled(OutlinedInput, {
  name: "AddNewGridDataElementForm",
  slot: "input",
})(() => ({}));

const AddNewGridDataElementForm = ({ onSubmit = (f) => f }) => {
  const { locationLayout, gridData, updateGridData } = useGridState();
  const [value, setValue] = useState("");

  const newLocationAlreadyExists = (location) =>
    locationLayout?.includes(location);

  const handleOnChange = (val) => {
    setValue(val);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnSubmit();
    }
  };

  /* Handles the submission of a new gridDataElement.
  **
  If this location already exists, it just finds the corresponding key in
  the gridData array and sends it back to the parent through onSubmit
  so that that row can be highlighted.
  If this location doesn't exist, it is added to locationLayout and the gridData
  is updated through updateGridData, and when this is complete, the parent
  is notified through the callback onSubmit and that new row is highlighted.
  **
   */
  const handleOnSubmit = () => {
    const valToSubmit = value.trim();
    if (newLocationAlreadyExists(valToSubmit)) {
      console.log(`${valToSubmit} already exists!`);
      const keyOfExistingLocation = gridData.findIndex(
        (element) => element.location === valToSubmit
      );
      onSubmit(keyOfExistingLocation);
    } else {
      const newLocationLayout = [...locationLayout, valToSubmit];
      updateGridData(gridData, newLocationLayout).then((res) => {
        if (res) {
          const keyOfNewLocation = res.findIndex(
            (element) => element.location === valToSubmit
          );
          onSubmit(keyOfNewLocation);
        }
      });
    }
    setValue("");
  };

  return (
    <Box>
      <StyledOutlinedInput
        placeholder={APP_TEXT.addGridDataElement}
        size="small"
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
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

export default AddNewGridDataElementForm;
