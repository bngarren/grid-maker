// MUI
import { Box, Paper, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// React hook form
import { Control, useWatch } from "react-hook-form";

// Context and utility
import { useSettings } from "../../global/Settings";
import { getWidthInPx, getDocumentStyle } from "../Document/MyDocument";
import useGridState from "../../global/useGridState";
import { TemplateElementId } from "../../global/gridState.types";
import { ptToPx } from "../../utils";

//Types

interface DemoBoxProps {
  control: Control;
  collapsed: boolean;
}

/* Styling */
//! DEBUG
const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const StyledGridBoxRoot = styled(Paper, {
  name: "DemoBox",
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "convertedWidth",
})<{ convertedWidth?: number }>(({ theme, convertedWidth }) => ({
  position: "relative",
  backgroundColor: "white",
  minHeight: getDocumentStyle("height"),
  height: getDocumentStyle("height"),
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  fontSize: `${getDocumentStyle("gridBoxFontSize")}px`,
  fontFamily: "Roboto",
  minWidth: `${convertedWidth}px`,
  maxWidth: `${convertedWidth}px`,
}));

const StyledGridBoxRow = styled(Box, {
  name: "DemoBox",
  slot: "row",
})(() => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
}));

const StyledGridBoxElement = styled(Box, {
  name: "DemoBox",
  slot: "element",
  shouldForwardProp: (prop) => prop !== "widthPercent",
})<{ widthPercent: number }>(({ widthPercent }) => ({
  width: `${widthPercent}%`,
  paddingLeft: getDocumentStyle("elementPaddingX"),
  paddingRight: getDocumentStyle("elementPaddingX"),
  lineHeight: getDocumentStyle("lineHeight"),
  letterSpacing: getDocumentStyle("letterSpacing"),
  //backgroundColor: getColor(),
}));

/* The demo grid box used for displaying what the grid box might look like */
const DemoBox = ({ control, collapsed }: DemoBoxProps) => {
  const { settings } = useSettings();
  const { gridTemplate } = useGridState();

  /* react-hook-form */
  const data: { [key: TemplateElementId]: string } = useWatch({ control });

  const convertedWidth = getWidthInPx(settings.document_cols_per_page);

  console.log("convertedWidth (px)", convertedWidth); //!DEBUG

  return (
    <>
      <Collapse in={!collapsed}>
        <Box
          sx={{
            /* Constrains the DemoBox and regulates scroll bar
            Important so that when gridsPerRow is 1, this wide box
            doesn't take up so much space but instead overflows  */
            margin: "auto",
            overflow: settings.document_cols_per_page > 1 ? "hidden" : "auto",
            maxWidth: {
              xs: `${convertedWidth}px`,
              md: `min(50vw, ${convertedWidth})px`,
            },
          }}
        >
          <StyledGridBoxRoot convertedWidth={convertedWidth}>
            {gridTemplate.rows.allIds.map((rowId) => (
              <StyledGridBoxRow key={rowId}>
                {gridTemplate.rows.byId[rowId].elements.map((rel) => {
                  const templateElement = gridTemplate?.elements.byId[rel];
                  const elementValue = data[templateElement.id];
                  return (
                    <StyledGridBoxElement
                      key={rel}
                      widthPercent={templateElement.styles.widthPercent}
                    >
                      {elementValue}
                    </StyledGridBoxElement>
                  );
                })}
              </StyledGridBoxRow>
            ))}
          </StyledGridBoxRoot>
        </Box>
      </Collapse>
    </>
  );
};

export default DemoBox;
