import * as React from "react";

import { DefaultTemplateGenerator } from "../../context/Template";
import TemplateEditorReducer from "./TemplateEditorReducer";

const TemplateEditorContext = React.createContext();

export const TemplateEditorProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(TemplateEditorReducer, {
    ...DefaultTemplateGenerator.template(),
  });

  /**
   * Set the entire template state according to a JSON input
   */
  const setTemplate = React.useCallback((templateJSON) => {
    const newTemplate = getTemplateObjectFromJSON(templateJSON);
    dispatch({ type: "setTemplate", payload: { newTemplate: newTemplate } });
  }, []);

  const updateIndexElement = React.useCallback((elementID) => {
    dispatch({
      type: "updateIndexElement",
      payload: { indexElement: elementID },
    });
  }, []);

  /**
   * Get a specific row's data (object) from the "rows" array, by index
   */
  const getRow = React.useCallback(
    (rowIndex) => state.rows[rowIndex],
    [state.rows]
  );

  /**
   * Gets an array of elements for a given row index
   */
  const getElementsForRowIndex = React.useMemo(
    () => (rowIndex) => {
      return state.elements.filter((se) =>
        state.rows[rowIndex].elements.includes(se.elementID)
      );
    },
    [rowIndex, state.rows, state.elements]
  );

  /**
   * Add a new row by providing data for the sole element in the new row
   */
  const addTemplateRow = React.useCallback((newElementData) => {
    dispatch({ type: "addRow", payload: { elementData: newElementData } });
  }, []);

  /**
   * Swap neighboring rows. The given row (by index) is moved +1, thus will not
   * work on rows without next neighbor (i.e. last row)
   */
  const swapRows = React.useCallback((rowIndex) => {
    dispatch({ type: "swapRows", payload: { rowIndex: rowIndex } });
  }, []);

  /**
   * Update a given row's "elements" array
   */
  const updateTemplateRowElements = React.useCallback(
    (templateRowIndex, newElementsData) => {
      dispatch({
        type: "updateRowElements",
        payload: { rowIndex: templateRowIndex, elements: newElementsData },
      });
    },
    []
  );

  /**
   * Update info about the template row (other than elements data)
   */
  const updateTemplateRowMeta = React.useCallback(
    (templateRowIndex, metaData) => {
      dispatch({
        type: "updateRowMeta",
        payload: { rowIndex: templateRowIndex, metaData: metaData },
      });
    },
    []
  );

  const value = {
    templateState: state,
    templateRows: state.rows,
    setTemplate,
    getRow,
    getElementsForRowIndex,
    addTemplateRow,
    swapRows,
    updateTemplateRowElements,
    updateTemplateRowMeta,
  };

  return (
    <TemplateEditorContext.Provider value={value}>
      {children}
    </TemplateEditorContext.Provider>
  );
};

export default TemplateEditorProvider;

export const useTemplateEditor = () => {
  const context = React.useContext(TemplateEditorContext);
  if (context === undefined) {
    throw new Error(
      "useTemplateEditor must be consumed within a TemplateEditorProvider component."
    );
  }
  return context;
};

function getTemplateObjectFromJSON(templateJSON) {
  let result;
  try {
    result = JSON.parse(templateJSON);
  } catch (error) {
    console.log("Error parsing template from JSON:", error.message);
  }
  console.log(result);
  return result;
}
