import { DefaultTemplateGenerator } from "../../context/Template";

const addRow = (state, newElementData) => {
  let newElement = {
    ...DefaultTemplateGenerator.element(),
    ...newElementData,
  };
  let newState = {
    ...state,
    rows: [
      ...state.rows,
      // add a new row here
      {
        ...DefaultTemplateGenerator.row(),
        // with a new element
        elements: [newElement.elementID],
      },
    ],
    // Just add new element to the end because it's guaranteed to be new/unique
    elements: [...state.elements, newElement],
  };
  return newState;
};

const swapRows = (state, rowIndex) => {
  let newRows = [...state.rows];
  // https://stackoverflow.com/a/59398737
  [newRows[rowIndex + 1], newRows[rowIndex]] = [
    newRows[rowIndex],
    newRows[rowIndex + 1],
  ];
  let newState = {
    ...state,
    rows: newRows,
  };
  return newState;
};

/**
 * Handles changes to a template row's elements. Some actions to a row affect
 * multiple elements, e.g. resizing, additions/deletions, and should be updated together with this function.
 *
 *
 * @param {Object} state Previous template state
 * @param {number} rowIndex Index of the row
 * @param {Object[]} newRowElements Array of elements for the row
 * @returns New template state
 */
const updateRowElements = (state, rowIndex, newRowElements) => {
  let newRows;
  /* Delete this row if it now has no elements */
  if (newRowElements.length === 0) {
    newRows = [...state.rows];
    newRows.splice(rowIndex, 1);
  } else {
    /* Otherwise, update the row's elements */
    newRows = state.rows.map((row, i) =>
      i === rowIndex
        ? { ...row, elements: newRowElements.map((n) => n.elementID) }
        : row
    );
  }

  /* Next, check to see if this row's elements array has dropped some elementID's
  since last state, and if they are used elsewhere (in other rows). If not, we will remove them. */

  // First, see which elementIDs are missing compared to previous state of row
  let elementIdsToRemove = state.rows[rowIndex].elements.filter(
    (k) => !newRows[rowIndex]?.elements.includes(k)
  );

  // If there are some missing, let's check the other rows in case they were using this element
  if (elementIdsToRemove.length > 0) {
    state.rows.forEach((row, row_i) => {
      /* Check other rows (not the one that was just modified) */
      if (row_i !== rowIndex) {
        /* If the elementID is present elsewhere, don't keep it in the to be removed bin */
        elementIdsToRemove.filter(
          (potential) => !row.elements.includes(potential)
        );
      }
    });
  }

  /* 
  Next, we update the state's elements array (contains each element object)

  The new state.elements is based on prev state.elements minus the now
  unused elementID's
  */
  let newElements = [...state.elements].filter(
    (p) => !elementIdsToRemove.includes(p.elementID)
  );

  /* Finally, add or update the new elements */
  if (newRowElements.length > 0) {
    newRowElements.forEach((nre) => {
      let [matching, index] = findByElementID(newElements, nre.elementID);
      if (matching) {
        newElements[index] = { ...matching, ...nre };
      } else {
        newElements.push(nre);
      }
    });
  }

  /* Create new state object */
  const newState = {
    ...state,
    rows: newRows,
    elements: newElements,
  };
  return newState;
};

const updateRowMeta = (state, rowIndex, newMetaData) => {
  let newRows = state.rows.map((row, i) =>
    i === rowIndex ? { ...row, ...newMetaData } : row
  );
  return {
    ...state,
    rows: newRows,
  };
};

/* Handles the complex state updates for useTemplateEditor's state */
const TemplateEditorReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "setTemplate":
      newState = {
        ...DefaultTemplateGenerator.template(),
        ...action.payload.newTemplate,
      };
      break;
    case "updateIndexElement":
      newState = {
        ...state,
        indexElement: action.payload.indexElement,
      };
      break;
    case "addRow":
      newState = addRow(state, action.payload.newElementData);
      break;
    case "swapRows":
      newState = swapRows(state, action.payload.rowIndex);
      break;
    case "updateRowElements":
      newState = updateRowElements(
        state,
        action.payload.rowIndex,
        action.payload.elements
      );
      break;

    case "updateRowMeta":
      newState = updateRowMeta(
        state,
        action.payload.rowIndex,
        action.payload.metaData
      );

      break;

    default:
      throw new Error();
  }
  return newState;
};

export default TemplateEditorReducer;

/* Helpers */
const findByElementID = (testArray, id) => {
  if (!Array.isArray(testArray)) {
    throw new Error("Not an array");
  }
  let index = testArray.findIndex((el) => el.elementID === id);
  return index !== -1 ? [testArray[index], index] : [];
};
