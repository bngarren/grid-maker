import * as React from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateGridData } from "./gridStateSlice";

// Utility
import useStable from "../hooks/useStable";
import {
  sortByLocation,
  isGridDataElementEmpty,
  mergeGridTemplateWithGridData,
} from "../utils";
import { v4 as uuidv4 } from "uuid";

const GridStateContext = React.createContext();

export default function GridStateProvider({ children }) {
  const gridTemplate = useSelector((state) => state.template);
  const [gridData, setGridData] = React.useState();
  const [gridIndex, setGridIndex] = React.useState();

  /* Need referentially stable values for use in useEffect.
  See https://stackoverflow.com/a/69331524 */
  const getStable = useStable({
    gridData,
    gridIndex,
  });

  /* Takes input data (array of gridDataObjects) and stores it in state as gridData.
  If a gridIndex parameter is passed, the data will conform to this. If gridIndex is null,
  the gridIndex will conform to the passed data, based on the gridTemplate's indexElement property.
  This allows gridData to have a gridIndex conformed to it, but also allows changes to gridIndex during app use
  to cause a change to gridData, i.e. dropping/adding gridDataObjects. */

  /**
   * _incomingGridData -- Grid data in the form of an array of objects
   * incomingGridIndex -- Array of strings, e.g. ["1", "2", "2B",] etc.
   */
  const updateGridData = React.useCallback(
    async (_incomingGridData, incomingGridIndex) => {
      /* First we handle the case of bad argument data */
      let incomingGridData = [];
      if (_incomingGridData != null && Array.isArray(_incomingGridData)) {
        incomingGridData = [..._incomingGridData];
      } else {
        console.warn(
          "updateGridData is being sent bad data! ",
          _incomingGridData
        );
      }

      /* If the gridIndex parameter is null, just conform gridIndex to the incoming data.
      However, if gridIndex is non-null but empty, ie. [], we will use it as such,
      as this may have been intended by setting the gridIndex to empty in order
      to clear the grid data. */
      let finalGridIndex = [];
      if (incomingGridIndex == null && incomingGridData.length !== 0) {
        incomingGridData.forEach((gdo) => {
          // gdo = gridDataObject
          finalGridIndex.push(gdo.location); //! CURRENTLY STUCK HERE
        });
      } else {
        finalGridIndex = incomingGridIndex || [];
      }
    },
    []
  );

  /*
  Try to get localStorage gridData, or use empty gridData by passing null
  */
  React.useEffect(() => {
    let initialGridData = null;

    try {
      const localStorageGridData = JSON.parse(localStorage.getItem("gridData"));
      if (localStorageGridData != null) {
        initialGridData = localStorageGridData;
      }
    } catch (error) {
      console.error("GridStateProvider", error.message);
      console.log("Initialing gridData with empty data.");
    } finally {
      updateGridData(initialGridData);
    }
  }, [updateGridData]);

  /* 
  Save gridData to local storage each time gridData changes 
  */
  React.useEffect(() => {
    if (gridData != null) {
      localStorage.setItem("gridData", JSON.stringify(gridData));
      console.log("Saved gridData to localStorage");
    }
  }, [gridData]);

  /*
   A new gridTemplate coming through
   */
  React.useEffect(() => {
    // Should have already been a validated template from Template
    // TemplatePage should also warn user about breaking changes to current gridData
    // Now we need to reconcile this gridTemplate with our current gridData and gridIndex

    if (gridTemplate == null) return;

    const { gridData: stableGridData } = getStable();

    /* 
    Merge this gridTemplate with gridData.     
    */
    //setGridData(mergeGridTemplateWithGridData(gridTemplate, stableGridData));
  }, [gridTemplate, getStable]);

  const value = {};

  return (
    <GridStateContext.Provider value={value}>
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridState = () => React.useContext(GridStateContext);
