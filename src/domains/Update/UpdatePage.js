import * as React from "react";

// MUI
import { Grid } from "@mui/material";

// Components
import TableGridDataObjects from "./TableGridDataObjects";
import { useDialog } from "../../components";
import EditorController from "./EditorController";

import GridDataObjectActionsContext from "./GridDataObjectActionsContext";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedGDO } from "./gridEditorSlice";
import useGridState from "../../global/useGridState";

// Utils/helpers
import { getAdjacentGridDataObject } from "./updateHelpers";

const UpdatePage = () => {
  const {
    gridData,
    addNewGridDataObject,
    clearGridDataObject,
    deleteGridDataObject,
    updateGridDataObject,
  } = useGridState();

  const dispatch = useDispatch();

  const selectedGDO = useSelector((state) => state.gridEditor.selectedGDO);
  const dirtyEditor = useSelector((state) => state.gridEditor.isDirty);

  const { confirm } = useDialog();

  /**
   *
   * @param {boolean} reverse If true, move backwards a gridDataObject. If false, move forwards.
   */
  const navigateAdjacentGridDataObject = React.useCallback(
    async (reverse) => {
      let proceed = true;
      const selectedIndex = gridData.findIndex((g) => g.id === selectedGDO.id);
      const gdo = gridData[selectedIndex];
      if (dirtyEditor) {
        proceed = false;
        // Show a confirm dialog if there is data that isn't saved
        const dialogTemplate = {
          title: "There is unsaved data for this grid location",
          content: `${gdo.id}`,
        };
        const res = await confirm(dialogTemplate);
        proceed = res;
      }

      if (proceed) {
        dispatch(
          updateSelectedGDO(
            getAdjacentGridDataObject(gridData, selectedIndex, reverse)
          )
        );
      }
    },
    [gridData, selectedGDO, dispatch, confirm, dirtyEditor]
  );

  /**
   *
   * @param {number} key Id of the gridDataObject to edit
   */
  const handleGridDataObjectEdit = React.useCallback(
    (gdoId) => async () => {
      let proceed = true;
      const gdo = gridData.find((g) => g.id === gdoId);
      if (dirtyEditor) {
        // Show a confirm dialog if there is data that isn't saved
        const dialogTemplate = {
          title: "There is unsaved data for this location",
          content: `${gdo.id}`,
        };
        const res = await confirm(dialogTemplate);
        proceed = res;
      }
      if (proceed) {
        /* Go ahead with changing the selectedGDO  */
        if (selectedGDO?.id === gdoId) {
          // re-clicked on the same gridDataObject
          dispatch(updateSelectedGDO(null));
        } else {
          dispatch(updateSelectedGDO(gdo));
        }
      }
    },
    [gridData, selectedGDO, dispatch, confirm, dirtyEditor]
  );

  /**
   *
   * @param {number} key Id of the gridDataObject to clear the data
   */
  const handleGridDataObjectClear = React.useCallback(
    (gdoId) => async () => {
      let proceed = false;

      // Show a confirm dialog before clearing
      const gdo = gridData.find((g) => g.id === gdoId);
      const dialogTemplate = {
        title: "Clear the data",
        content: `${gdo.id}
        (The grid location will remain.)`,
      };
      const res = await confirm(dialogTemplate);
      proceed = res;

      if (proceed) {
        clearGridDataObject(gdoId);
      }
    },
    [gridData, clearGridDataObject, confirm]
  );

  /**
   *
   * @param {number} key Id of the gridDataObject to delete
   */
  const handleGridDataObjectDelete = React.useCallback(
    (gdoId) => async () => {
      let proceed = false;

      // Show a confirm dialog before removing
      const gdo = gridData.find((g) => g.id === gdoId);
      const dialogTemplate = {
        title: "Remove this grid location and all data?",
        content: `${gdo.id}`,
      };
      const res = await confirm(dialogTemplate);
      proceed = res;

      if (proceed) {
        deleteGridDataObject(gdoId);
        dispatch(updateSelectedGDO(null));
      }
    },
    [gridData, deleteGridDataObject, dispatch, confirm]
  );

  /**
   * Handles the Save action
   */
  const onEditorControllerSave = React.useCallback(
    async (editorData) => {
      updateGridDataObject(selectedGDO.id, editorData);
      return true;
    },
    [updateGridDataObject, selectedGDO]
  );

  const gridDataObjectActions = React.useMemo(
    () => ({
      gdoActionsEdit: handleGridDataObjectEdit,
      gdoActionsClear: handleGridDataObjectClear,
      gdoActionsDelete: handleGridDataObjectDelete,
    }),
    [
      handleGridDataObjectClear,
      handleGridDataObjectDelete,
      handleGridDataObjectEdit,
    ]
  );

  return (
    <div>
      <Grid container>
        <Grid item lg={4} md={5} sm={10} xs={12} sx={{ py: 0, px: 1, mb: 1 }}>
          <button onClick={addNewGridDataObject}>Add new GDO</button>
          <GridDataObjectActionsContext.Provider value={gridDataObjectActions}>
            <TableGridDataObjects />
          </GridDataObjectActionsContext.Provider>
        </Grid>
        <Grid item lg md sm={0} xs>
          {selectedGDO != null && (
            <>
              <EditorController
                onNavigateGridDataObject={navigateAdjacentGridDataObject}
                onSave={onEditorControllerSave}
              />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdatePage;
