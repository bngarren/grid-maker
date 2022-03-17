import * as React from "react";

// MUI
import { styled } from "@mui/system";
import { Autocomplete, Checkbox, Popper } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Components
import EditorTextField from "./EditorTextField";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/* Styling */

const StyledAutocomplete = styled(Autocomplete, {
  name: "ContingencyInput",
  slot: "root",
})(({ theme }) => ({
  "& .MuiAutocomplete-option": {
    minHeight: "auto",
    alignItems: "center",
    padding: 3,
    // Selected
    '&[aria-selected="true"]': {},
    // Hover
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    },
  },
  "& .MuiAutocomplete-inputRoot": {
    padding: "4px 4px 5px 6px",
  },
}));

const StyledPopper = styled(Popper, {
  name: "ContingencyInput",
  slot: "popper",
})(({ theme }) => ({}));

const StyledListBox = styled("ul", {
  name: "ContingencyInput",
  slot: "listbox",
})(({ theme }) => ({}));

const CustomPopper = (props) => {
  return (
    <StyledPopper
      {...props}
      style={{ width: "300px" }}
      placement="auto-start"
    />
  );
};

/* Should be wrapped by a Controller component from react-hook-form which renders
this ContingencyInput component and passes in the field prop */
const ContingencyInput = React.forwardRef(
  ({ options, label, field, isDirty, ...props }, ref) => {
    return (
      <StyledAutocomplete
        {...props}
        ref={field.ref}
        limitTags={5}
        fullWidth
        multiple
        freeSolo
        clearOnBlur
        filterSelectedOptions
        options={options}
        onChange={(_, data) => field.onChange(data)}
        value={field.value}
        ListboxComponent={StyledListBox}
        PopperComponent={CustomPopper}
        renderInput={({
          InputLabelProps,
          InputProps,
          inputProps,
          ...params
        }) => {
          return (
            <EditorTextField
              InputProps={{
                ...InputProps,
              }}
              InputLabelProps={{
                ...InputLabelProps,
              }}
              ref={InputProps.ref}
              inputProps={{
                ...inputProps,
              }}
              {...params}
              label={label}
              isDirty={isDirty}
              placeholder="Add contingency"
            />
          );
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              sx={{
                mr: 1,
                padding: "3px",
                color: "primary.light",
                "&:hover": {
                  color: "primary.main",
                },
              }}
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
      />
    );
  }
);

export default ContingencyInput;
