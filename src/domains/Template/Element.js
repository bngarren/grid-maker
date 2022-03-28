import * as React from "react";

// MUI
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled, alpha } from "@mui/system";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InfoIcon from "@mui/icons-material/Info";

// Popover
import PopupState, { bindToggle, bindPopover } from "material-ui-popup-state";

import ElementPopover from "./ElementPopover";
import DefaultTemplate from "./DefaultTemplate";

/* Styling */
const StyledElementRoot = styled(Box, {
  name: "Element",
  slot: "root",
})(({ props, theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  boxSizing: "content-box",
}));

const Element = React.forwardRef(
  (
    {
      element,
      isIndexElement,
      handleUpdateIndexElement,
      handleResizeLeft,
      handleResizeRight,
      showResizeLeft,
      showResizeRight,
      handleUpdateElement,
      handleRemoveElement,
      lastElement,
    },
    ref
  ) => {
    const color1 = alpha(element.color, 0.3);
    const color2 = alpha(element.color, 0.8);
    const isPlaceholder =
      element.type === DefaultTemplate.templateElementType.placeholder;
    return (
      <StyledElementRoot
        ref={ref}
        sx={{
          width: `${element.widthPercent}%`,
          height: "100%",
          borderRight: !lastElement && "2px solid black",
          backgroundColor: color1,
          ...(isPlaceholder && {
            backgroundImage: `linear-gradient(135deg, #777 25%, #999 25%, #999 50%, #777 50%, #777 75%, #999 75%, #999 100%)`,
            backgroundSize: "56.57px 56.57px",
          }),
        }}
      >
        {showResizeLeft && (
          <IconButton onClick={(e) => handleResizeLeft(e, element.id)}>
            <ArrowLeftIcon />
          </IconButton>
        )}
        <PopupState variant="popover" popupId={`elementPopover-${element.id}`}>
          {(popupState) => (
            <div>
              <Tooltip
                title={
                  isPlaceholder ? "Placeholder" : element.name || "Untitled"
                }
              >
                <IconButton {...bindToggle(popupState)}>
                  <InfoIcon
                    sx={{
                      color: color2,
                      fontSize: "1.5rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <ElementPopover
                {...bindPopover(popupState)}
                popupState={popupState}
                element={element}
                isIndexElement={isIndexElement}
                onChangeIndexElement={handleUpdateIndexElement}
                onChangeElement={handleUpdateElement}
                onDeleteElement={handleRemoveElement}
              />
            </div>
          )}
        </PopupState>
        {showResizeRight && (
          <IconButton onClick={(e) => handleResizeRight(e, element.id)}>
            <ArrowRightIcon />
          </IconButton>
        )}
      </StyledElementRoot>
    );
  }
);

export default Element;
