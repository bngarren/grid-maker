import * as React from "react";
import {
  Box,
  Popover,
  Button,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  PopoverProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

import { PopupState } from "material-ui-popup-state/core";
import {
  TemplateElement,
  TemplateElementId,
  TemplateElementType,
} from "../../global/gridState.types";

// Types
interface ElementPopoverProps {
  popupState: PopupState;
  element: TemplateElement;
  isOnlyRowElement: boolean;
  isIndexElement: boolean;
  onChangeIndexElement: (
    elementId: TemplateElementId | null | undefined
  ) => void;
  onChangeElement: (
    elementId: TemplateElementId,
    newElementData: TemplateElement
  ) => void;
  onDeleteElement: (elementId: TemplateElementId) => void;
}

const ElementPopover = React.forwardRef(
  (
    {
      popupState,
      element,
      isOnlyRowElement,
      isIndexElement,
      onChangeIndexElement,
      onChangeElement,
      onDeleteElement,
      ...props
    }: ElementPopoverProps & PopoverProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    // Controlled inputs
    const [name, setName] = React.useState<string>("");
    const [type, setType] = React.useState<TemplateElementType>("text_single");
    const [useAsIndex, setUseAsIndex] = React.useState<boolean>();

    const reset = React.useCallback(() => {
      setName(element.name ?? "");
      setType(element.type);
      setUseAsIndex(isIndexElement || false);
    }, [element, isIndexElement]);

    React.useEffect(() => {
      reset();
    }, [element, reset]);

    const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      const newElementData = { ...element, name: name, type: type };

      onChangeElement(element.id, newElementData);

      if (useAsIndex !== isIndexElement) {
        onChangeIndexElement(useAsIndex ? element.id : null);
      }

      popupState.close();
    };

    const handleOnClose = () => {
      popupState.close();
      reset();
    };

    const handleCloseButton = () => {
      handleOnClose();
    };

    return (
      <Popover
        ref={ref}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        {...props}
        onClose={handleOnClose}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "300px",
            MinHeight: "200px",
            boxShadow: `inset 0px 0px 0px 4px ${element.styles.color}`,
            padding: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={handleCloseButton}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "1rem",
              }}
            >{`Width: ${Math.round(element.styles.widthPercent)}%`}</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useAsIndex}
                  onChange={(e) => setUseAsIndex((prev) => !prev)}
                />
              }
              label="Use as Index?"
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-type">Input type</InputLabel>
              <Select
                labelId="select-type"
                id="select-type"
                value={type}
                onChange={(e: SelectChangeEvent) =>
                  setType(e.target.value as TemplateElementType)
                }
                label="Input type"
              >
                <MenuItem value={"text_single"}>Single line</MenuItem>
                <MenuItem value={"text_multiline"} disabled={!isOnlyRowElement}>
                  Multiline
                </MenuItem>
                <MenuItem value={"placeholder"}>Placeholder</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <IconButton onClick={() => onDeleteElement(element.id)}>
              <DeleteIcon />
            </IconButton>
            <Button onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </Popover>
    );
  }
);

ElementPopover.displayName = "ElementPopover";
export default ElementPopover;
