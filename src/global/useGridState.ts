import * as React from "react";

// Redux
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  addGridDataObject,
  clearGridDataObject,
  deleteGridDataObject,
  updateGridDataObject,
} from "./gridStateSlice";

// Utility
import { v4 as uuidv4 } from "uuid";

// Types
import {
  FormElementValues,
  GridDataObjectId,
  GridTemplate,
  GridData,
  GridDataObject,
} from "./gridState.types";

const generateDefaultGridDataObject = (): GridDataObject => {
  return {
    id: uuidv4(),
    indexElementValue: "",
    elements: [],
  };
};

const useGridState = () => {
  const dispatch = useAppDispatch();
  const gridTemplate: GridTemplate = useAppSelector(
    (state) => state.gridState.template
  );
  const gridData: GridData = useAppSelector(
    (state) => state.gridState.gridData
  );

  /**
   * Adds a new gridDataObject to gridData with the supplied value used as
   * the index (i.e. indexElementValue)
   */
  const addNewGridDataObject = React.useCallback(
    (value: string) => {
      dispatch(
        addGridDataObject({
          ...generateDefaultGridDataObject(),
          indexElementValue: value,
        })
      );
    },
    [dispatch]
  );

  const _clearGridDataObject = React.useCallback(
    (gdoId: GridDataObjectId) => {
      dispatch(clearGridDataObject({ gdoId: gdoId }));
    },
    [dispatch]
  );

  const _deleteGridDataObject = React.useCallback(
    (gdoId: GridDataObjectId) => {
      dispatch(deleteGridDataObject({ gdoId: gdoId }));
    },
    [dispatch]
  );

  const _updateGridDataObject = React.useCallback(
    (gdoId: GridDataObjectId, gdoElementValues: FormElementValues) => {
      dispatch(
        updateGridDataObject({
          gdoId: gdoId,
          formElementValues: gdoElementValues,
        })
      );
    },
    [dispatch]
  );

  const getGridDataObjectById = React.useCallback(
    (gdoId: GridDataObjectId) => {
      return gridData.find((g) => g.id === gdoId);
    },
    [gridData]
  );

  return {
    gridTemplate,
    gridData,
    addNewGridDataObject,
    clearGridDataObject: _clearGridDataObject,
    deleteGridDataObject: _deleteGridDataObject,
    updateGridDataObject: _updateGridDataObject,
    getGridDataObjectById,
  };
};

export default useGridState;
