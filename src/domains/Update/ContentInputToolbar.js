import { useState } from "react";

// MUI
import {
  AppBar,
  Toolbar,
  Stack,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";

// React-hook-form
import { Controller } from "react-hook-form";

// Components
import QuickAddInput from "./QuickAddInput";
import ToggleContentType from "./ToggleContentType";

/* Styling */
const StyledAppBar = styled(AppBar, {
  name: "ContentInputToolbar",
  slot: "appbar",
})(({ theme }) => ({
  backgroundColor: "transparent",
  flexShrink: "inherit",
  zIndex: "100",
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

const StyledToolBar = styled(Toolbar, {
  name: "ContentInputToolbar",
  slot: "toolbar",
})(() => ({
  padding: "4px 2px 2px 8px",
  minHeight: "3rem",
}));

const divider_sx = {
  margin: "0 6px",
};

const ContentInputToolbar = ({
  control,
  contentType,
  onAddSection = (f) => f,
  onSelectTemplate = (f) => f,
}) => {
  return (
    <StyledAppBar position="static" square={true} elevation={0}>
      <StyledToolBar disableGutters variant="dense">
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          {/* Registers ToggleContentType as an input field of the form declared in EditorController */}
          <Controller
            name="contentType"
            control={control}
            render={({ field }) => <ToggleContentType field={field} />}
          />
          {contentType === "nested" && (
            <>
              <QuickAddInput onSubmit={onAddSection} />
              <Divider orientation="vertical" flexItem sx={{ ...divider_sx }} />
              <SelectTemplate onSelect={onSelectTemplate} />
            </>
          )}
        </Stack>
      </StyledToolBar>
    </StyledAppBar>
  );
};

/* Styling for SelectTemplate */

const StyledTextField = styled(TextField, {
  name: "SelectTemplate",
  slot: "textfield",
})(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "8px 0px 4px 8px",
    lineHeight: "inherit",
    "&.Mui-focused fieldset": {
      borderWidth: "0.1em",
      borderColor: theme.palette.primary.main,
      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: theme.typography.formFontSizeLevel2,
    padding: 0,
  },
}));

const selectSx = {
  background: "white",
  color: "#676767",
  "& .MuiOutlinedInput-input.MuiSelect-select": {
    height: "inherit",
  },
};

const SelectTemplate = ({ onSelect = (f) => f }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    console.log(val);

    if (val && val !== "" && val?.length > 0) {
      onSelect(val);
      setValue("");
    } else {
      setValue(val);
    }
  };

  return (
    <StyledTextField
      value={value}
      onChange={handleChange}
      select
      id="selectTemplate"
      overflow="hidden"
      size="small"
      SelectProps={{
        sx: selectSx,
        displayEmpty: true,
        MenuProps: {
          PaperProps: {
            elevation: 2,
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        },
      }}
    >
      <MenuItem value="" sx={{ fontSize: "formFontSizeLevel2" }}>
        Select a template...
      </MenuItem>

      {OPTIONS.map((option) => {
        return (
          <MenuItem
            key={option.id}
            value={option.value}
            sx={{
              fontSize: "formFontSizeLevel1",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {option.name}
          </MenuItem>
        );
      })}
    </StyledTextField>
  );
};

const OPTIONS = [
  {
    id: 1,
    name: "Systems long",
    value: ["NEURO", "RESP", "CV", "FEN", "ID", "HEME", "ENDO", "ACCESS"],
  },
  {
    id: 2,
    name: "Systems brief",
    value: ["N", "R", "CV", "F", "ID", "H", "E", "ACC"],
  },
  {
    id: 3,
    name: "Active/TODO",
    value: ["Active Issues", "TODO"],
  },
];

export default ContentInputToolbar;
