import * as React from "react";
import {
  Box,
  Popover,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useTemplateEditor } from "./TemplateEditor";

const TemplateRowMenu = React.forwardRef(
  ({ popupState, index, onAddElement, ...props }, ref) => {
    const { getRow, updateTemplateRowMeta } = useTemplateEditor();
    const row = getRow(index);

    const reset = React.useCallback(() => {}, []);

    React.useEffect(() => {
      reset();
    }, [reset]);

    const handleOnClose = () => {
      popupState.close();
      reset();
    };

    const handleCloseButton = () => {
      handleOnClose();
    };

    const handleChangeHeightFactor = () => {
      updateTemplateRowMeta(index, {
        heightFactor: row.heightFactor * -1,
      });
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
            <IconButton onClick={onAddElement}>
              <AddIcon />
            </IconButton>
            <FormControlLabel
              control={
                <Checkbox
                  checked={row.heightFactor === -1}
                  onChange={handleChangeHeightFactor}
                />
              }
              label="Fill height?"
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
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Popover>
    );
  }
);

export default TemplateRowMenu;
