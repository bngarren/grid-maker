import * as React from "react";

//MUI
import { Stack, Box, IconButton, Button, Alert } from "@mui/material";
import { styled } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";

// Redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setTemplate, addTemplateRow } from "./templateEditorSlice";
import { updateTemplate } from "../../global/gridStateSlice";

// Components
import TemplateRow from "./TemplateRow";

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
})(() => ({
  position: "relative",
  boxSizing: "content-box",
  width: GRIDBOX_CONSTRAINTS.width,
  minHeight: GRIDBOX_CONSTRAINTS.height,
  maxHeight: GRIDBOX_CONSTRAINTS.height,
  margin: "auto",
  border: "2px solid black",
}));

const TemplatePage = () => {
  const gridStateTemplate = useAppSelector((state) => state.gridState.template);
  const templateEditorState = useAppSelector((state) => state.templateEditor);
  const templateRows = templateEditorState.rows.allIds.map(
    (rowId) => templateEditorState.rows.byId[rowId]
  );
  const dispatch = useAppDispatch();

  const [errors, setErrors] = React.useState([]);

  // Use the gridState template on mount of TemplatePage
  React.useEffect(() => {
    if (gridStateTemplate) {
      dispatch(setTemplate(gridStateTemplate));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let newErrors = [];
    if (templateEditorState.indexElement == null) {
      newErrors.push("Missing index element");
    }
    if (templateEditorState.elements.allIds.length === 0) {
      newErrors.push("Need at least 1 element");
    }
    setErrors(newErrors);
  }, [templateEditorState]);

  const handleAddTemplateRow = () => {
    if (templateRows.length >= GRIDBOX_CONSTRAINTS.maxRows) {
      return;
    }
    dispatch(addTemplateRow());
  };

  const handleSaveTemplate = () => {
    // json.parse/stringify in order to remove nested references, i.e. deep copy
    dispatch(updateTemplate(JSON.parse(JSON.stringify(templateEditorState))));
  };

  return (
    <div>
      <Button onClick={handleSaveTemplate}>Save</Button>
      <Stack direction="column" spacing={0.5}>
        {errors &&
          errors.map((error, ei) => (
            <Alert key={`${ei}-${error}`} severity="error">
              {error}
            </Alert>
          ))}
      </Stack>
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
                key={tr.id}
                id={tr.id}
                constraints={TEMPLATE_ROW_CONSTRAINTS}
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
      <JSONPreview data={JSON.stringify(templateEditorState, null, 3)} />
    </div>
  );
};

export default TemplatePage;

const JSONPreview = ({ data }) => {
  return (
    <Box
      sx={{
        margin: "40px auto 0px auto",
        fontSize: "0.8rem",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        height: "400px",
        overflow: "auto",
      }}
    >
      <pre style={{ textAlign: "left" }}>
        <code>{data}</code>
      </pre>
    </Box>
  );
};
