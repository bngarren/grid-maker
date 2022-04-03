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

const generateDefaultGridDataObject = () => {
  return {
    id: uuidv4(),
    indexElementValue: "",
    elements: [],
  };
};

const useGridState = () => {
  const dispatch = useDispatch();
  const gridTemplate = useSelector((state) => state.gridState.template);
  const gridData = useSelector((state) => state.gridState.gridData);

  const addNewGridDataObject = React.useCallback(() => {
    dispatch(
      addGridDataObject({
        ...generateDefaultGridDataObject(),
      })
    );
  }, [dispatch]);

  const _clearGridDataObject = React.useCallback(
    (gdoId) => {
      dispatch(clearGridDataObject({ id: gdoId }));
    },
    [dispatch]
  );

  const _deleteGridDataObject = React.useCallback(
    (gdoId) => {
      dispatch(deleteGridDataObject({ id: gdoId }));
    },
    [dispatch]
  );

  const _updateGridDataObject = React.useCallback(
    (gdoId, gdoElementValues) => {
      dispatch(
        updateGridDataObject({ gdoId: gdoId, elementValues: gdoElementValues })
      );
    },
    [dispatch]
  );

  const getGridDataObjectById = React.useCallback(
    (gdoId) => {
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
