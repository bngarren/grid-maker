import * as React from "react";
import {
  Box,
  Popover,
  Button,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

import { TemplateElementType } from "../../context/Template";

const ElementPopover = React.forwardRef(
  (
    { popupState, element, index, onChangeElement, onDeleteElement, ...props },
    ref
  ) => {
    const [name, setName] = React.useState();
    const [placeholder, setPlaceholder] = React.useState();

    const reset = React.useCallback(() => {
      setName(element.name || "");
      setPlaceholder(element.type === TemplateElementType.placeholder || false);
    }, [element]);

    React.useEffect(() => {
      reset();
    }, [element, reset]);

    const handleSubmit = (e) => {
      e.preventDefault();

      let newType;
      if (placeholder) {
        newType = TemplateElementType.placeholder;
      } else {
        newType = TemplateElementType.text_single;
      }

      let newElementData = { ...element, name: name, type: newType };

      onChangeElement(element.elementID, newElementData);
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
            height: "200px",
            boxShadow: `inset 0px 0px 0px 4px ${element.color}`,
            padding: "8px",
          }}
        >
          <Box
            name="header"
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
            name="content"
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "1rem",
              }}
            >{`Width: ${Math.round(element.widthPercent)}%`}</Typography>
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
            name="footer"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <IconButton onClick={() => onDeleteElement(element.elementID)}>
              <DeleteIcon />
            </IconButton>
            <Button onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </Popover>
    );
  }
);

export default ElementPopover;
