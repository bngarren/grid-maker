// MUI
import { Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system";

import { bindMenu } from "material-ui-popup-state/hooks";

/* Styling */
const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: "1rem",
}));

const ActionsPopover = ({
  popupState,
  onSelectDelete = (f) => f,
  onSelectClear = (f) => f,
}) => {
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
