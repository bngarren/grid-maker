import * as React from "react";

// MUI
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

import MenuIcon from "@mui/icons-material/Menu";

import PopupState, { bindToggle, bindPopover } from "material-ui-popup-state";

import useElements from "./useElements";
import { useTemplateEditor } from "./TemplateEditor";
import Element from "./Element";
import TemplateRowMenu from "./TemplateRowMenu";

/* Styling */

const StyledTemplateRowRoot = styled(Box, {
  name: "TemplateRoot",
  slot: "root",
})(({ theme }) => ({}));

const TemplateRow = ({
  templateRowIndex,
  constraints,
  MoveArrows,
  notLastRow,
}) => {
  const root = React.useRef();

  const { getRow, getElementsForRowIndex, updateTemplateRowMeta } =
    useTemplateEditor();
  const { heightFactor } = getRow(templateRowIndex);
  const elements = getElementsForRowIndex(templateRowIndex);

  const {
    localElements,
    refs,
    addLocalElement,
    removeLocalElement,
    resizeRight,
    resizeLeft,
    updateLocalElement,
  } = useElements(templateRowIndex, elements, constraints);

  React.useEffect(() => {
    let resizeObserver = new ResizeObserver((entries) => {
      updateTemplateRowMeta(templateRowIndex, {
        heightPixel: entries[0].contentRect.height,
      });
    });
    resizeObserver.observe(root.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateTemplateRowMeta, templateRowIndex]);

  return (
    <StyledTemplateRowRoot
      ref={root}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        //width: constraints.maxWidth,
        height:
          heightFactor === -1 ? "100%" : heightFactor * constraints.minHeight,
        minHeight: constraints.minHeight,
        borderBottom: notLastRow && "2px solid black",
      }}
    >
      {localElements.map((el, idx) => {
        const prevElement = Boolean(elements[idx - 1]);
        const nextElement = Boolean(elements[idx + 1]);

        return (
          <Element
            key={el.elementID}
            ref={(domEl) => (refs.current[idx] = domEl)}
            element={el}
            index={idx}
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
        {MoveArrows && MoveArrows}
      </Box>
      <Box
        direction="row"
        sx={{
          position: "absolute",
          top: 0,
          right: "-50px",
        }}
      >
        <PopupState variant="popover" popupId={`rowMenu-${templateRowIndex}`}>
          {(menuPopupState) => (
            <div>
              <Tooltip title={`Edit Row ${templateRowIndex + 1}`}>
                <IconButton {...bindToggle(menuPopupState)}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <TemplateRowMenu
                {...bindPopover(menuPopupState)}
                popupState={menuPopupState}
                index={templateRowIndex} // row index
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
