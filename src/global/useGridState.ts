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
import { APP_TEXT } from "../utils";

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

  /**
   * Checks a given indexElementValue for being valid and unique
   *@returns {Object} status: true if success, false if error. message: ""
   */
  const validateIndexElementValue = React.useCallback(
    (value: string): { status: boolean; message?: string } => {
      const result = {
        status: true,
        message: "",
      };

      // Cannot be empty
      if (value.trim().length === 0) {
        result.status = false;
        result.message = APP_TEXT.noEmptyIndexElementValueInput;
        return result;
      }

      // Must be unique
      gridData.forEach((gdo) => {
        const indexElement = gdo.elements.find(
          (f) => f.id === gridTemplate.indexElement
        );
        if (indexElement?.value === value) {
          result.status = false;
          result.message = APP_TEXT.nonUniqueIndexElementValueInput;
        }
      });

      return result;
    },
    [gridData, gridTemplate.indexElement]
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

  const getIndexElementName = React.useCallback(() => {
    return gridTemplate.elements.byId[gridTemplate.indexElement].name;
  }, [gridTemplate.elements.byId, gridTemplate.indexElement]);

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
    validateIndexElementValue,
    clearGridDataObject: _clearGridDataObject,
    deleteGridDataObject: _deleteGridDataObject,
    updateGridDataObject: _updateGridDataObject,
    getIndexElementName,
    getGridDataObjectById,
  };
};

export default useGridState;
