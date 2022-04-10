// MUI
import { Box, Paper, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// React hook form
import { Control, useWatch } from "react-hook-form";

// Context and utility
import { useSettings } from "../../global/Settings";
import { getWidth } from "../Document/MyDocument";
import useGridState from "../../global/useGridState";
import { TemplateElementId } from "../../global/gridState.types";

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
})<{ convertedWidth?: string }>(({ theme, convertedWidth }) => ({
  position: "relative",
  backgroundColor: "white",
  height: "250pt",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  fontSize: "9pt",
  fontFamily: "Roboto",
  minWidth: convertedWidth,
  maxWidth: convertedWidth,
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
  //backgroundColor: getColor(),
}));

/* The demo grid box used for displaying what the grid box might look like */
const DemoBox = ({ control, collapsed }: DemoBoxProps) => {
  const { settings } = useSettings();
  const { gridTemplate } = useGridState();

  /* react-hook-form */
  const data: { [key: TemplateElementId]: string } = useWatch({ control });

  const convertedWidth = getWidth(settings.document_cols_per_page, 1.15);

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
              xs: convertedWidth,
              md: `min(50vw, ${convertedWidth})`,
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
                      widthPercent={templateElement.widthPercent}
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
