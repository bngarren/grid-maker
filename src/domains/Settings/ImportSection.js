import * as React from "react";

// MUI
import { Box, Stack, Typography, Zoom, CircularProgress } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Custom components
import { ButtonStandard } from "../../components";
import { useImporter } from "../../domains/IO/useImporter";
import ImportList from "./ImportList";

// GridData context
import useGridState from "../../global/useGridState";

const ImportSection = () => {
  /* Use this hook to updateGridData once new data is imported */
  // const { updateGridData } = useGridState();

  /* The useImporter custom hook will manage our importer data
  and state, including status.
  
  importedData - an object containining the cleaned and validated data from JSON file. 
  The imported grid data is accessed via importedData.gridData
  */
  const { file, importedData, upload, confirm, cancel, status, STATUS, error } =
    useImporter();

  const importedGridData = importedData?.gridData || [];

  const [gridDataToSave, setGridDataToSave] = React.useState(
    importedGridData || []
  );

  /* How many items for import are currently selected */
  const selected = gridDataToSave.length;

  /* Determines how to display the Accept button */
  const enableSave = !error && selected > 0;

  // When to use an "s"
  const plural = selected > 1;

  /* Handles when the ImportList component changes its selection. This
  prepares a new slice of data to be imported. */
  const onNewSelectionOfItemsToImport = React.useCallback((selectedItems) => {
    setGridDataToSave(selectedItems);
  }, []);

  /* The user has accepted the import (and thus the potential overwrite
  of new grid data). This will callback to useImporter and 
  update gridState */
  const handleConfirm = () => {
    confirm(); //useImporter
    // updateGridData(gridDataToSave); //! TODO
  };

  /* See useImporter for details of STATUS enum. We use this status state to
  conditionally render this component based on the different parts of the
  import process (e.g. starting state, loading, pending confirmation, and confirmed, etc.) */
  return (
    <Box>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={1}>
          {status === STATUS.Loading && (
            <CircularProgress
              disableShrink
              size="2rem"
              sx={{ color: "primary" }}
            />
          )}
          {status !== STATUS.Pending && (
            <Box>
              <input
                id="inputFile"
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={upload}
              />
              <label htmlFor="inputFile">
                <ButtonStandard component="span" secondary>
                  Import Grid
                </ButtonStandard>
              </label>
            </Box>
          )}
          {status === STATUS.Pending && (
            <Zoom in={status === STATUS.Pending}>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.main",
                    fontStyle: "italic",
                  }}
                >
                  {file && file.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <ButtonStandard
                    onClick={handleConfirm}
                    disabled={!enableSave}
                  >
                    Accept
                  </ButtonStandard>
                  <ButtonStandard onClick={cancel} secondary>
                    Cancel
                  </ButtonStandard>
                </Stack>
              </Stack>
            </Zoom>
          )}

          {status === STATUS.Confirmed && (
            <Stack
              direction="row"
              sx={{ alignItems: "center", color: "secondary.dark" }}
            >
              <CheckBoxIcon />
              <Typography variant="body2">
                {`${selected} ${
                  plural ? "items" : "item"
                } successfully imported.`}
              </Typography>
            </Stack>
          )}
          {error && (
            <Typography
              variant="body2"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "error.main",
              }}
            >
              Error. There was a problem with the file or corrupted data.
            </Typography>
          )}
        </Stack>
        {status === STATUS.Pending && importedGridData?.length > 0 && (
          <ImportList
            data={importedGridData}
            onChangeSelected={onNewSelectionOfItemsToImport}
          />
        )}
      </Stack>
    </Box>
  );
};

export default ImportSection;
