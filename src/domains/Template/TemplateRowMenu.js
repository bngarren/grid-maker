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

// Reduce
import { useSelector, useDispatch } from "react-redux";
import { updateTemplateRowFillHeight } from "./templateEditorSlice";

const TemplateRowMenu = React.forwardRef(
  ({ popupState, rowId, onAddElement, ...props }, ref) => {
    const dispatch = useDispatch();
    const row = useSelector((state) => state.templateEditor.rows.byId[rowId]);
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

    const handleChangeFillHeight = () => {
      dispatch(
        updateTemplateRowFillHeight({
          rowId: rowId,
          fillHeight: !row.fillHeight,
        })
      );
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
                  checked={row.fillHeight}
                  onChange={handleChangeFillHeight}
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
