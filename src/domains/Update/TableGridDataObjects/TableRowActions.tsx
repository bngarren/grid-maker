import * as React from "react";
import { usePopupState } from "material-ui-popup-state/hooks";
import { GridDataObjectId } from "../../../global/gridState.types";
import GridDataObjectActionsContext from "./GridDataObjectActionsContext";
import {
  buttonPaddingSx,
  StyledActionsDiv,
  StyledMenuIcon,
  StyledMenuIconButton,
  StyledMenuOpenIcon,
  StyledRadioButton,
} from "./StyledTableComponents";
import ActionsPopover from "./ActionsPopover";

interface TableRowActionsProps {
  isSelected: boolean;
  gridDataObjectId: GridDataObjectId;
}

const TableRowActions = React.memo(function TableRowActions({
  isSelected,
  gridDataObjectId,
}: TableRowActionsProps) {
  const { gdoActionsEdit, gdoActionsDelete, gdoActionsClear } =
    React.useContext(GridDataObjectActionsContext);

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({
    variant: "popover",
    popupId: "actionsMenu",
  });

  const handleOnClickMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    popupState.open(e);
  };

  return (
    <StyledActionsDiv>
      <StyledRadioButton
        checked={isSelected}
        onClick={gdoActionsEdit(gridDataObjectId)}
        sx={{
          ...buttonPaddingSx,
        }}
      />
      <StyledMenuIconButton
        onClick={handleOnClickMenu}
        size="large"
        sx={{
          ...buttonPaddingSx,
        }}
      >
        {popupState.isOpen ? (
          <StyledMenuOpenIcon fontSize="small" />
        ) : (
          <StyledMenuIcon fontSize="small" />
        )}
      </StyledMenuIconButton>

      <ActionsPopover
        popupState={popupState}
        onSelectDelete={gdoActionsDelete(gridDataObjectId)} //curried
        onSelectClear={gdoActionsClear(gridDataObjectId)} //curried
      />
    </StyledActionsDiv>
  );
});

export default TableRowActions;
