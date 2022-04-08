import * as React from "react";

// MUI
import { Grid } from "@mui/material";

// Components
import TableGridDataObjects from "./TableGridDataObjects/TableGridDataObjects";
import { useDialog } from "../../components";
import EditorController from "./EditorController";

import GridDataObjectActionsContext from "./TableGridDataObjects/GridDataObjectActionsContext";

// Redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { updateSelectedGDO } from "./gridEditorSlice";
import useGridState from "../../global/useGridState";

// Utils/helpers
import { getAdjacentGridDataObject } from "./updateHelpers";

// Types
import {
  FormElementValues,
  GridDataObjectId,
} from "../../global/gridState.types";

const UpdatePage = () => {
  const {
    gridData,
    clearGridDataObject,
    deleteGridDataObject,
    updateGridDataObject,
  } = useGridState();

  const dispatch = useAppDispatch();

  const selectedGDO = useAppSelector((state) => state.gridEditor.selectedGDO);
  const dirtyEditor = useAppSelector((state) => state.gridEditor.isDirty);
  const templateIndexElementId = useAppSelector(
    (state) => state.gridState.template.indexElement
  );

  const { confirm } = useDialog();

  /**
   * Changes the selected GDO, in sequential order, either forward or reverse
   * @param {boolean} reverse If true, move backwards a gridDataObject. If false, move forwards.
   */
  const navigateAdjacentGridDataObject = React.useCallback(
    async (reverse: boolean) => {
      let proceed = true;
      const selectedIndex = gridData.findIndex((g) => g.id === selectedGDO?.id);
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
    (gdoId: GridDataObjectId) => async () => {
      let proceed = true;
      const gdo = gridData.find((g) => g.id === gdoId);

      // Error
      if (gdo == null) {
        selectedGDO && updateSelectedGDO(null);
        return;
      }

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
    (gdoId: GridDataObjectId) => async () => {
      let proceed = false;
      const gdo = gridData.find((g) => g.id === gdoId);

      // Error
      if (gdo == null) return;

      // Show a confirm dialog before clearing
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
    (gdoId: GridDataObjectId) => async () => {
      let proceed = false;
      const gdo = gridData.find((g) => g.id === gdoId);

      // Error
      if (gdo == null) return;

      // Show a confirm dialog before removing
      const dialogTemplate = {
        title: "Remove this grid location and all data?",
        content: `${gdo.id}`,
      };
      const res = await confirm(dialogTemplate);
      proceed = res;

      if (proceed) {
        deleteGridDataObject(gdoId);
      }
    },
    [gridData, deleteGridDataObject, confirm]
  );

  /**
   * Handles the Save action
   */
  const onEditorControllerSave = React.useCallback(
    async (editorFormData: FormElementValues) => {
      // Error - should not be saving if there is no selected GDO
      if (selectedGDO == null) return false;

      // Handle case - user is attemping to change value of index element
      // ? Not sure if we want to allow duplicates
      // For now, will use dialog with option to overwrite
      const formIndexElementValue = editorFormData[templateIndexElementId];
      const changingIndexElementValue =
        selectedGDO.indexElementValue !== formIndexElementValue;

      let proceed = true;
      if (changingIndexElementValue) {
        proceed = false;
        // Show a confirm dialog before changing index value (could overwrite other GDO's data)
        const dialogTemplate = {
          title:
            "Warning: Changing the value of the index may overwrite other data.",
          content: `You are about to set new index to: ${formIndexElementValue} (previously: ${selectedGDO.indexElementValue})`,
        };
        const confirmResult = await confirm(dialogTemplate);
        proceed = confirmResult;
      }

      if (proceed) {
        updateGridDataObject(selectedGDO.id, editorFormData);
        return true;
      } else return false;
    },
    [updateGridDataObject, selectedGDO, confirm, templateIndexElementId]
  );

  /**
   * Serves as the value for the GridDataObjectActionsContext provider.
   * Contains functions that act on a given gridDataObject
   */
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
    <Grid container>
      <Grid item lg={4} md={5} sm={10} xs={12} sx={{ py: 0, px: 1, mb: 1 }}>
        <GridDataObjectActionsContext.Provider value={gridDataObjectActions}>
          <TableGridDataObjects />
        </GridDataObjectActionsContext.Provider>
      </Grid>
      <Grid item lg md sm={0} xs>
        {selectedGDO != null && (
          <EditorController
            onNavigateGridDataObject={navigateAdjacentGridDataObject}
            onSave={onEditorControllerSave}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default UpdatePage;
