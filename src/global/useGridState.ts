import * as React from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  addGridDataObject,
  clearGridDataObject,
  deleteGridDataObject,
  updateGridDataObject,
} from "./gridStateSlice";

// Utility
import { v4 as uuidv4 } from "uuid";

// Types
import { RootState } from "../store";
import {
  FormElementValues,
  GridDataObjectId,
  GridTemplate,
  GridData,
} from "./gridState.types";

const generateDefaultGridDataObject = () => {
  return {
    id: uuidv4(),
    indexElementValue: "",
    elements: [],
  };
};

const useGridState = () => {
  const dispatch = useDispatch();
  const gridTemplate: GridTemplate = useSelector(
    (state: RootState) => state.gridState.template
  );
  const gridData: GridData = useSelector(
    (state: RootState) => state.gridState.gridData
  );

  const addNewGridDataObject = React.useCallback(() => {
    dispatch(
      addGridDataObject({
        ...generateDefaultGridDataObject(),
      })
    );
  }, [dispatch]);

  const _clearGridDataObject = React.useCallback(
    (gdoId: GridDataObjectId) => {
      dispatch(clearGridDataObject({ id: gdoId }));
    },
    [dispatch]
  );

  const _deleteGridDataObject = React.useCallback(
    (gdoId: GridDataObjectId) => {
      dispatch(deleteGridDataObject({ id: gdoId }));
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
