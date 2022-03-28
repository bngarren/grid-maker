//MUI
import { Box, IconButton, Button } from "@mui/material";
import { styled } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useTemplateEditor } from "./TemplateEditor";
import { useTemplate } from "../../context/Template";
import TemplateRow from "./TemplateRow";
import SwapButton from "./SwapButton";

const GRIDBOX_CONSTRAINTS = {
  width: 700,
  height: 400,
  minRowHeight: 50,
  minElementWidth: 10,
  maxElements: 4,
  maxRows: 8,
};

/* how much an element increments/decrements in size */
const ELEMENT_WIDTH_DELTA = 5;

const TEMPLATE_ROW_CONSTRAINTS = {
  maxWidth: GRIDBOX_CONSTRAINTS.width,
  minHeight: GRIDBOX_CONSTRAINTS.minRowHeight,
  minElementWidth: GRIDBOX_CONSTRAINTS.minElementWidth,
  maxElements: GRIDBOX_CONSTRAINTS.maxElements,
  widthDelta: ELEMENT_WIDTH_DELTA,
};

/* Styling */
const StyledGridBoxRoot = styled(Box, {
  name: "GridBox",
  slot: "root",
})(({ theme }) => ({
  position: "relative",
  boxSizing: "content-box",
  width: GRIDBOX_CONSTRAINTS.width,
  minHeight: GRIDBOX_CONSTRAINTS.height,
  maxHeight: GRIDBOX_CONSTRAINTS.height,
  margin: "auto",
  border: "2px solid black",
}));

const TemplatePage = () => {
  const { templateState, templateRows, addTemplateRow, swapRows } =
    useTemplateEditor();

  const { gridTemplate, setGridTemplate } = useTemplate();

  const handleAddTemplateRow = () => {
    if (templateRows.length >= GRIDBOX_CONSTRAINTS.maxRows) {
      return;
    }
    addTemplateRow({
      widthPercent: 100,
    });
  };

  const handleMoveTemplateRow = (rowIndex) => {
    swapRows(rowIndex);
  };

  const handleSaveTemplate = () => {
    setGridTemplate(templateState);
  };

  return (
    <div>
      <Button onClick={handleSaveTemplate}>Save</Button>
      <StyledGridBoxRoot>
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          {templateRows?.map((tr, i) => {
            const notLastRow = templateRows.length - i > 1;
            return (
              <TemplateRow
                key={tr.rowID}
                templateRowIndex={i}
                constraints={TEMPLATE_ROW_CONSTRAINTS}
                MoveArrows={
                  notLastRow ? (
                    <SwapButton onClick={() => handleMoveTemplateRow(i)} />
                  ) : null
                }
                notLastRow={notLastRow}
              />
            );
          })}
          <IconButton
            sx={{
              position: "absolute",
              bottom: -50,
              right: 0,
            }}
            onClick={handleAddTemplateRow}
          >
            <AddBoxIcon />
          </IconButton>
        </Box>
      </StyledGridBoxRoot>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <pre style={{ textAlign: "left" }}>
          <code>{JSON.stringify(templateState, null, 2)}</code>
        </pre>
      </Box>
    </div>
  );
};

export default TemplatePage;
