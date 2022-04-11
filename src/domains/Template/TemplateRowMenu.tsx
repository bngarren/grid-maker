import * as React from "react";
import {
  Box,
  Popover,
  IconButton,
  FormControlLabel,
  Checkbox,
  PopoverProps,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Reduce
import { useAppSelector, useAppDispatch } from "../../hooks";
import { updateTemplateRowFillHeight } from "./templateEditorSlice";

// Types
import { PopupState } from "material-ui-popup-state/core";
import { TemplateRowId } from "../../global/gridState.types";
interface TemplateRowMenuProps {
  popupState: PopupState;
  rowId: TemplateRowId;
  onAddElement: () => void;
}

const TemplateRowMenu = React.forwardRef(
  (
    {
      popupState,
      rowId,
      onAddElement,
      ...props
    }: TemplateRowMenuProps & PopoverProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();
    const row = useAppSelector(
      (state) => state.templateEditor.rows.byId[rowId]
    );
    const reset = React.useCallback(() => {
      return;
    }, []);

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

TemplateRowMenu.displayName = "TemplateRowMenu";
export default TemplateRowMenu;
