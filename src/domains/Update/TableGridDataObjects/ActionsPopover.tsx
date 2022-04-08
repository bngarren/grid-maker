// MUI
import { Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import { bindMenu } from "material-ui-popup-state/hooks";

// Types
import { PopupState } from "material-ui-popup-state/core";

/* Styling */
const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: "1rem",
}));

interface ActionsPopover {
  popupState: PopupState;
  onSelectDelete: () => void;
  onSelectClear: () => void;
}

const ActionsPopover = ({
  popupState,
  onSelectDelete,
  onSelectClear,
}: ActionsPopover) => {
  const handleSelectDelete = () => {
    popupState.close();
    onSelectDelete();
  };
  const handleSelectClear = () => {
    popupState.close();
    onSelectClear();
  };

  return (
    <>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <StyledMenuItem onClick={handleSelectClear} key="clear">
          Clear data
        </StyledMenuItem>
        <StyledMenuItem onClick={handleSelectDelete} key="delete">
          Remove item
        </StyledMenuItem>
      </Menu>
    </>
  );
};

export default ActionsPopover;
