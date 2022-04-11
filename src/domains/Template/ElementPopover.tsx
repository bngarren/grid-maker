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
    const [placeholder, setPlaceholder] = React.useState<boolean>();
    const [useAsIndex, setUseAsIndex] = React.useState<boolean>();

    const reset = React.useCallback(() => {
      setName(element.name ?? "");
      setPlaceholder(element.type === "placeholder" || false);
      setUseAsIndex(isIndexElement || false);
    }, [element, isIndexElement]);

    React.useEffect(() => {
      reset();
    }, [element, reset]);

    const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      let newType: TemplateElementType;
      if (placeholder) {
        newType = "placeholder";
      } else {
        newType = "text_single";
      }

      const newElementData = { ...element, name: name, type: newType };

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
            <FormControlLabel
              control={
                <Checkbox
                  checked={placeholder}
                  onChange={(e) => setPlaceholder((prev) => !prev)}
                />
              }
              label="Placeholder?"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={placeholder}
            />
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
