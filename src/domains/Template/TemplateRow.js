import * as React from "react";

// MUI
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  swapTemplateRows,
  updateTemplateRowHeight,
} from "./templateEditorSlice";

// Utility
import { cloneDeep } from "lodash-es";

// Popover
import PopupState, { bindToggle, bindPopover } from "material-ui-popup-state";

import useElements from "./useElements";

// Components
import SwapButton from "./SwapButton";
import Element from "./Element";
import TemplateRowMenu from "./TemplateRowMenu";

/* Styling */

const StyledTemplateRowRoot = styled(Box, {
  name: "TemplateRoot",
  slot: "root",
})(({ theme }) => ({}));

const TemplateRow = ({ id, constraints, notLastRow }) => {
  const root = React.useRef();

  const dispatch = useDispatch();
  const indexElement = useSelector(
    (state) => state.templateEditor.indexElement
  );
  const row = useSelector((state) => state.templateEditor.rows.byId[id]);

  /* Have to use lodash cloneDeep to get copy that doesn't mutate nested redux state 
  Refer to: https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
  */
  const elements = cloneDeep(
    useSelector((state) =>
      row.elements.map((_el) => state.templateEditor.elements.byId[_el])
    )
  );

  const {
    localElements,
    refs,
    addLocalElement,
    removeLocalElement,
    resizeRight,
    resizeLeft,
    updateLocalElement,
    setIndexElement,
  } = useElements(row.id, elements, constraints);

  /* Listens to resize events of the root div of the row and stores them in state */
  React.useLayoutEffect(() => {
    let resizeObserver = new ResizeObserver((entries) => {
      dispatch(
        updateTemplateRowHeight({
          rowId: row.id,
          rowHeight: entries[0].contentRect.height,
        })
      );
    });
    resizeObserver.observe(root.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [row.id, dispatch]);

  return (
    <StyledTemplateRowRoot
      ref={root}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        //width: constraints.maxWidth,
        height: row.fillHeight ? "100%" : constraints.minHeight,
        minHeight: constraints.minHeight,
        borderBottom: notLastRow && "2px solid black",
      }}
    >
      {localElements?.map((el, idx) => {
        const prevElement = Boolean(elements[idx - 1]);
        const nextElement = Boolean(elements[idx + 1]);

        return (
          <Element
            key={el.id}
            ref={(domEl) => (refs.current[idx] = domEl)}
            element={el}
            isIndexElement={el.id === indexElement}
            handleUpdateIndexElement={setIndexElement}
            handleResizeLeft={resizeLeft}
            handleResizeRight={resizeRight}
            showResizeLeft={prevElement}
            showResizeRight={nextElement}
            handleUpdateElement={updateLocalElement}
            handleRemoveElement={removeLocalElement}
            lastElement={!nextElement}
          />
        );
      })}
      <Box
        sx={{
          position: "absolute",
          bottom: "-15px",
          left: "-30px",
          transform: "rotate(90deg)",
        }}
      >
        {notLastRow && (
          <SwapButton onClick={() => dispatch(swapTemplateRows(row.id))} />
        )}
      </Box>
      <Box
        direction="row"
        sx={{
          position: "absolute",
          top: 0,
          right: "-50px",
        }}
      >
        <PopupState variant="popover" popupId={`rowMenu-${row.id}`}>
          {(menuPopupState) => (
            <div>
              <Tooltip title={`Edit Row`}>
                <IconButton {...bindToggle(menuPopupState)}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <TemplateRowMenu
                {...bindPopover(menuPopupState)}
                popupState={menuPopupState}
                rowId={row.id}
                onAddElement={addLocalElement}
              />
            </div>
          )}
        </PopupState>
      </Box>
    </StyledTemplateRowRoot>
  );
};

export default TemplateRow;
