import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// MUI
import { useMediaQuery, Grid, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";

// Components
import TableGridDataElements from "./TableGridDataElements";
import EditorController from "./EditorController";
import { useDialog } from "../../components";

// Context
import GridDataElementActionsContext from "./GridDataElementActionsContext";

// Utils/helpers
import {
  DEFAULT_GRID_DATA_ELEMENT_DATA,
  getKeyForGridDataElementID,
} from "../../utils";
import {
  doesLocationExistInGridData,
  getAdjacentGridDataElement,
} from "./updateHelpers";
import { v4 as uuidv4 } from "uuid";

// Firebase
import { useGridState } from "../../context/GridState";

const UpdatePage = () => {
  // Media queries for CSS
  const media_atleast_md = useMediaQuery("(min-width:960px)");

  // The truth GridState and gridData
  const { gridData, census, updateGridData } = useGridState();

  /* Index of the gridDataElement selected and currently being "edited" */
  const [selectedKey, setSelectedKey] = useState(null);

  /* true, if an unsaved changed has occurred in EditorController's react-hook-form */
  const dirtyEditorController = useRef(false);

  /* An initial or "default" set of data for a gridDataElement */
  const [defaultGridDataElementData, setDefaultGridDataElementData] = useState(
    []
  );

  const { confirm } = useDialog();

  /* UpdatePage keeps this default gridDataElement data in its state in order to pass
  to EditorController when a gridDataElement is selected. It combines any of
  the selected GDE's data with default data so that EditorController
  has at least some appropriate value for every property of GDE */
  useEffect(() => {
    if (selectedKey != null && gridData != null) {
      const selectedData = {
        ...(gridData?.length !== 0 &&
          selectedKey != null &&
          gridData[selectedKey]),
      };
      setDefaultGridDataElementData({
        ...DEFAULT_GRID_DATA_ELEMENT_DATA,
        ...selectedData,
      });
    }
  }, [selectedKey, gridData]);

  const handleDirtyEditor = useCallback((isDirty, dirtyFields) => {
    dirtyEditorController.current = isDirty;
  }, []);

  /* Used as a target for the scrollToElement(), in order to put
 the GridDataElementEditor into view after clicking the edit icon on smaller screens */
  const refToGridDataElementEditorDiv = useRef(null);

  const setCurrentGridDataElement = (key) => {
    // This is the key of the grid data array that corresponds to this selected gridDataElement
    setSelectedKey(key);
  };

  /* 
  - - - NAVIGATION - - -
  
  Handles the < and > buttons for selecting the previous or next gridDataElement.
  Calls setCurrentGridDataElement which updates the selectedKey and GridDataElementEditor's data */
  /**
   *
   * @param {boolean} reverse If true, move backwards a gridDataElement. If false, move forwards.
   */
  const navigateAdjacentGridDataElement = useCallback(
    async (reverse) => {
      let proceed = true;
      if (dirtyEditorController.current) {
        proceed = false;
        // Show a confirm dialog if there is data that isn't saved
        const gdeData = { ...gridData[selectedKey] };
        const dialogTemplate = {
          title: "There is unsaved data for this location",
          content: `Location: ${gdeData.location}`,
        };
        const res = await confirm(dialogTemplate);
        proceed = res;
      }

      if (proceed) {
        setCurrentGridDataElement(
          getAdjacentGridDataElement(gridData, selectedKey, reverse)
        );
      }
    },
    [gridData, selectedKey, confirm]
  );

  const handleGridDataElementActionEdit = useCallback(
    async (key) => {
      let proceed = true;
      if (dirtyEditorController.current) {
        // Show a confirm dialog if there is data that isn't saved
        const gdeData = { ...gridData[selectedKey] };
        const dialogTemplate = {
          title: "There is unsaved data for this location",
          content: `Location: ${gdeData.location}`,
        };
        const res = await confirm(dialogTemplate);
        proceed = res;
      }
      if (proceed) {
        /* Go ahead with changing the selectedKey  */
        if (selectedKey === key) {
          // re-clicked on the same gridDataElement
          setSelectedKey(null);
        } else {
          setCurrentGridDataElement(key);

          if (refToGridDataElementEditorDiv && !media_atleast_md) {
            setTimeout(() => {
              refToGridDataElementEditorDiv?.current?.scrollIntoView(false);
            }, 200);
          }
        }
      }
    },
    [media_atleast_md, dirtyEditorController, gridData, selectedKey, confirm]
  );

  /**
   *
   * @param {number} key Index of the gridDataElement to clear the data
   */
  const handleGridDataElementActionClear = useCallback(
    async (key) => {
      let proceed = false;

      // Show a confirm dialog before clearing
      const gdeData = { ...gridData[key] };
      const dialogTemplate = {
        title: "Clear the data at this location",
        content: `Location: ${gdeData.location}
        (The location will remain.)`,
      };
      const res = await confirm(dialogTemplate);
      proceed = res;

      if (proceed) {
        let updatedData = [...gridData];
        // only keep the id and location
        updatedData[key] = {
          id: updatedData[key].id,
          location: updatedData[key].location,
        };
        updateGridData(updatedData); //send new data to GridState context (handles truth data)
      }
    },
    [gridData, updateGridData, confirm]
  );

  const handleGridDataElementActionDelete = useCallback(
    async (key) => {
      let proceed = false;

      // Show a confirm dialog before removing
      const gdeData = { ...gridData[key] };
      const dialogTemplate = {
        title: "Remove this location and all data?",
        content: `Location: ${gdeData.location}`,
      };
      const res = await confirm(dialogTemplate);
      proceed = res;

      if (proceed) {
        let updatedData = [...gridData];
        updatedData.splice(key, 1); // will return the deleted items, but we don't use them for now
        updateGridData(updatedData); //send new data to GridStateContext (handles truth data)

        setSelectedKey(null);
      }
    },
    [gridData, updateGridData, confirm]
  );

  /* Handles the SAVE action.
  - Before trying to merge this modified gridDataElement data with the gridData (in GridStateContext),
  we can run some checks, E.g., see if there has been a new location entered--because 
  we will warn the user that this may overwrite any data in that target location
  */
  const onEditorControllerSave = useCallback(
    async (editorData) => {
      const updatedData = [...gridData]; // copy the current gridData

      let changingLocation = Boolean(
        editorData.location !== gridData[selectedKey].location
      );
      let proceed = true;
      //* See if gridDataElementEditor's data has changed the location for this gridDataElement
      if (changingLocation) {
        proceed = false;
        // Show a confirm dialog before changing location (could overwrite other location's data)
        const dialogTemplate = {
          title: "Changing to this location will overwrite any current data",
          content: `Target location: ${editorData.location}`,
        };
        const confirmResult = await confirm(dialogTemplate);
        proceed = confirmResult;

        if (!proceed) {
          /* The user has chosen not to proceed */
          return proceed;
        } else {
          /* We are proceeding with saving data in a new location... */
          // See if this location already exists in gridData
          const { objIndex, locationAlreadyExists } =
            doesLocationExistInGridData(editorData, updatedData);
          /* If location already exists, overwrite with new data */
          if (locationAlreadyExists) {
            updatedData[objIndex] = editorData;
          } else {
            // If location doesn't exist, add new one
            updatedData.push(editorData);
          }

          // clear the gridDataElement's data at the previous location, but keep the location present (don't delete)
          updatedData[selectedKey] = {
            id: uuidv4(), // new id for the old gridDataElement
            location: updatedData[selectedKey].location,
          };
        }
      } else {
        /* Changed some aspect of the gridDataElement but not the location */
        updatedData[selectedKey] = editorData;
      }

      //* Send updated data to GridStateContext
      try {
        let res = await updateGridData(updatedData);
        if (res) {
          const newKey = getKeyForGridDataElementID(res, editorData.id);
          setSelectedKey(newKey);
          return res;
        } else {
          throw new Error("bad result from updateGridData");
        }
      } catch (error) {
        setSelectedKey(null);
        console.error("UpdatePage", error);
      }
    },
    [gridData, selectedKey, updateGridData, confirm]
  );

  const gridDataElementActions = useMemo(
    () => ({
      gridDataElementActionEdit: handleGridDataElementActionEdit,
      gridDataElementActionClear: handleGridDataElementActionClear,
      gridDataElementActionDelete: handleGridDataElementActionDelete,
    }),
    [
      handleGridDataElementActionClear,
      handleGridDataElementActionDelete,
      handleGridDataElementActionEdit,
    ]
  );

  /* - - - - - RETURN - - - - - */

  if (gridData != null) {
    return (
      <div>
        <Grid container>
          <Grid item lg={4} md={5} sm={10} xs={12} sx={{ py: 0, px: 1, mb: 1 }}>
            <GridDataElementActionsContext.Provider
              value={gridDataElementActions}
            >
              <TableGridDataElements
                data={gridData}
                selectedKey={selectedKey}
              />
            </GridDataElementActionsContext.Provider>
            {census ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  p: 0.5,
                  pt: 1,
                }}
              >
                <Typography variant="caption">
                  {`${census.filledTotal}/${census.total}`}{" "}
                  {census.emptyElements.length > 0 &&
                    `[${census.emptyElements.toString()}]`}
                </Typography>
                {census.teamTotals.map((t) => {
                  return (
                    <Typography variant="caption" key={t.id}>
                      <b>{t.id}</b>
                      {`: ${t.value}`}
                    </Typography>
                  );
                })}
              </Box>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item lg md sm={0} xs ref={refToGridDataElementEditorDiv}>
            {selectedKey != null &&
              defaultGridDataElementData?.length !== 0 && (
                <EditorController
                  initialGridDataElementData={defaultGridDataElementData}
                  dirtyFormCallback={handleDirtyEditor}
                  onChangeGridDataElement={navigateAdjacentGridDataElement}
                  onSave={onEditorControllerSave}
                />
              )}
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};
export default UpdatePage;
