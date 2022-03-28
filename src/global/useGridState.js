import * as React from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  addGridDataObject,
  clearGridDataObject,
  deleteGridDataObject,
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

  const getGridDataObjectById = React.useCallback(
    (gdoId) => {
      return gridData.find((g) => g.id === gdoId);
    },
    [gridData]
  );

  return {
    gridData,
    addNewGridDataObject,
    clearGridDataObject: _clearGridDataObject,
    deleteGridDataObject: _deleteGridDataObject,
    getGridDataObjectById,
  };
};

export default useGridState;
