import * as React from "react";

// MUI
import {
  Grid,
  Stack,
  Paper,
  Divider,
  Typography,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";

// Context
import { useGridState } from "../../global/GridState";

// Utility
import { isGridDataElementEmpty } from "../../utils";

/* Styling */
const StyledButton = styled(ButtonUnstyled, {
  name: "ExportList",
  slot: "button",
})(({ theme, disabled }) => ({
  border: 0,
  borderRadius: 2,
  padding: "0px 6px",
  backgroundColor: "transparent",
  fontSize: theme.typography.formFontSizeLevel3,
  cursor: "pointer",
  pointerEvents: disabled ? "none" : "inherit",
  // not disabled
  ...(!disabled && {
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
  }),
}));

/* This component renders the Checkbox for each gridDataElement */
const ExportItem = ({ value, selected, toggleSelected }) => {
  if (value != null) {
    /* Check if properties exist and are non-empty */
    const location = typeof value.location === "string" && value.location;
    const lastName =
      typeof value.lastName === "string" &&
      value.lastName.length &&
      value.lastName;

    const empty = isGridDataElementEmpty(value);

    const label = (
      <>
        <Typography
          variant="body2"
          component="span"
          sx={{ color: empty && "grey.600" }}
        >
          {location}
        </Typography>
        <Typography variant="body2" component="span">
          {lastName && ` - ${lastName}`}
        </Typography>
      </>
    );

    return (
      <FormControlLabel
        sx={{ margin: 0 }}
        control={
          <Checkbox
            size="small"
            checked={selected}
            onClick={toggleSelected(value)}
            sx={{
              p: "3px",
              color: "primary.light",
              "&.Mui-checked": {
                color: "primary.light",
              },
            }}
          />
        }
        label={label}
      />
    );
  } else {
    return <></>;
  }
};

/**
 * A component that allows choosing a portion of the gridData to
 * be selected for export. Each time a new selection is made, a callback
 * is fired on the parent (ExportSection) to let it update it's object for export.
 * Remember to check ImportList component as well with any changes,
 * as they share similar code but currently not DRY
 * @param {function()} onChangeSelected - callback each time a new selection is made
 * @returns React component
 */
const ExportList = ({ onChangeSelected = (f) => f }) => {
  const { gridData } = useGridState();

  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState([]);

  /* If new gridData comes in, reset the list so that all of them
  start off selected */
  React.useEffect(() => {
    setSelected([...gridData]);
  }, [gridData]);

  /* Each time a new selection is made, send this back to parent so
  that this new group can be exported */
  React.useEffect(() => {
    onChangeSelected(selected);
  }, [selected, onChangeSelected]);

  const errorNoGridDataElements = gridData.length < 1;
  const errorNoneSelected = selected.length < 1;
  const errorMessage = () => {
    if (errorNoneSelected) {
      return errorNoGridDataElements
        ? "There are no items to export. Add items to your grid."
        : "Please select at least 1 item to export.";
    }
  };

  const handleToggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggleSelection = (value) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  /* The following are functions that help the user select/filter the list. 
  TODO Consider adding an Autocomplete field that allows user to choose certain filters
   */
  const handleSelectAll = () => {
    setSelected([...gridData]);
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleFilterNonEmpty = () => {
    const newSelected = selected.filter((el) => !isGridDataElementEmpty(el));
    setSelected(newSelected);
  };

  /* Generates the list of items. Divides list into 2 columns if 
  longer than threshold */
  const THRESHOLD = 15;
  const listOfExportItems = () => {
    /* Single column, if less than this size */
    if (gridData.length <= THRESHOLD) {
      return (
        <Stack sx={{ pl: 4 }}>
          {gridData.map((gde) => {
            return (
              <ExportItem
                key={gde.id}
                value={gde}
                selected={selected.indexOf(gde) !== -1}
                toggleSelected={handleToggleSelection}
              />
            );
          })}
        </Stack>
      );
    } else {
      /* Split into 2 columns */
      const halfwayIndex = Math.floor(gridData.length / 2);
      const firstHalf = gridData.slice(0, halfwayIndex);
      const secondHalf = gridData.slice(halfwayIndex, gridData.length);

      return (
        <Grid
          container
          sx={{
            justifyContent: {
              xs: "flex-start",
              sm: "space-evenly",
            },
          }}
        >
          {[firstHalf, secondHalf].map((data, key) => {
            return (
              <Grid item xs="auto" key={key}>
                <Stack>
                  {data.map((value) => {
                    return (
                      <ExportItem
                        key={value.id}
                        value={value}
                        selected={selected.indexOf(value) !== -1}
                        toggleSelected={handleToggleSelection}
                      />
                    );
                  })}
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      );
    }
  };

  return (
    <FormControl
      error={errorNoneSelected}
      component="fieldset"
      variant="standard"
      sx={{ width: "100%" }}
    >
      <Stack
        direction="row"
        spacing={0}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{
          justifyContent: "space-evenly",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Typography
            variant="overline"
            sx={{
              color: errorNoneSelected && "error.main",
            }}
          >
            <b>{selected.length}</b> of {gridData.length} items selected
          </Typography>

          <IconButton
            size="small"
            onClick={handleToggleExpanded}
            sx={{ p: "1px 3px" }}
            disabled={errorNoGridDataElements}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>

        <StyledButton
          onClick={handleSelectAll}
          disabled={errorNoGridDataElements}
        >
          Select All
        </StyledButton>
        <StyledButton
          onClick={handleClearAll}
          disabled={errorNoGridDataElements}
        >
          Clear All
        </StyledButton>
        <Tooltip title="Filter empty items">
          <IconButton
            size="small"
            onClick={handleFilterNonEmpty}
            sx={{ p: "2px" }}
            disabled={errorNoGridDataElements}
          >
            <FilterAltIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Paper elevation={expanded ? 1 : 0} sx={{ pb: "8px" }} square={true}>
        <FormHelperText sx={{ textAlign: "center" }}>
          {errorMessage()}
        </FormHelperText>
        <Collapse in={expanded} sx={{ ...(expanded && { pt: "8px" }) }}>
          {listOfExportItems()}
        </Collapse>
      </Paper>
    </FormControl>
  );
};

export default ExportList;
