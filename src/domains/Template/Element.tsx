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
import {
  TemplateElement,
  TemplateElementId,
} from "../../global/gridState.types";

// Types
interface ElementProps {
  element: TemplateElement;
  isOnlyRowElement: boolean;
  isIndexElement: boolean;
  handleUpdateIndexElement: (
    elementId: TemplateElementId | null | undefined
  ) => void;
  handleResizeLeft: (e: React.MouseEvent, elementId: TemplateElementId) => void;
  handleResizeRight: (
    e: React.MouseEvent,
    elementId: TemplateElementId
  ) => void;
  showResizeLeft: boolean;
  showResizeRight: boolean;
  handleUpdateElement: (
    elementId: TemplateElementId,
    newElementData: TemplateElement
  ) => void;
  handleRemoveElement: (elementId: TemplateElementId) => void;
  lastElement: boolean;
}

/* Styling */
const StyledElementRoot = styled(Box, {
  name: "Element",
  slot: "root",
})(() => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  boxSizing: "content-box",
}));

const Element = React.forwardRef(
  (
    {
      element,
      isOnlyRowElement,
      isIndexElement,
      handleUpdateIndexElement,
      handleResizeLeft,
      handleResizeRight,
      showResizeLeft,
      showResizeRight,
      handleUpdateElement,
      handleRemoveElement,
      lastElement,
    }: ElementProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const color1 = alpha(element.styles.color, 0.3);
    const color2 = alpha(element.styles.color, 0.8);
    const isPlaceholder = element.type === "placeholder";
    return (
      <StyledElementRoot
        ref={ref}
        sx={{
          width: `${element.styles.widthPercent}%`,
          height: "100%",
          borderRight: !lastElement ? "2px solid black" : "none",
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
                isOnlyRowElement={isOnlyRowElement}
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

Element.displayName = "Element";
export default Element;
