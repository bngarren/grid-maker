import { createSlice, current } from "@reduxjs/toolkit";
import DefaultTemplate from "./DefaultTemplate";

const _addRow = (state, action) => {
  const newElement = {
    ...DefaultTemplate.element(),
    ...action.payload,
  };
  const newRow = {
    ...DefaultTemplate.row(),
    // with a new element
    elements: [newElement.id],
  };
  state.rows.byId[newRow.id] = newRow;
  state.rows.allIds.push(newRow.id);

  state.elements.byId[newElement.id] = newElement;
  state.elements.allIds.push(newElement.id);

  // Add new indexElement if null/undefined
  if (!state.indexElement) {
    state.indexElement = newRow.elements[0];
  }

  console.log(current(state)); //! DEBUG
};

const _swapRows = (state, action) => {
  const rowId = action.payload;
  const rowIndex = state.rows.allIds.indexOf(rowId);
  if (state.rows.allIds[rowIndex + 1] != null) {
    let newRows = [...state.rows.allIds];
    // https://stackoverflow.com/a/59398737
    [newRows[rowIndex + 1], newRows[rowIndex]] = [
      newRows[rowIndex],
      newRows[rowIndex + 1],
    ];
    state.rows.allIds = newRows;
  }
};

const _updateRowHeight = (state, { payload }) => {
  const rowId = payload.rowId;
  const rowHeight = payload.rowHeight;
  state.rows.byId[rowId].heightPixel = rowHeight;
};

const _updateRowElements = (state, { payload }) => {
  const rowId = payload.rowId;
  const rowElements = payload.rowElements;

  let prevElements = [...state.rows.byId[rowId].elements];

  /* Next, check to see if this row's 'elements' array has dropped some elementID's
  since last state, and check if they are used elsewhere (in other rows). If not, we will remove them. */

  // First, see which elementIDs are missing compared to previous state of row
  let elementIdsToRemove = prevElements.filter(
    (pe) => findByElementID(rowElements, pe) === -1
  );

  // If there are some missing, let's check the other rows in case they were using this element
  if (elementIdsToRemove.length > 0) {
    for (const [key, value] of Object.entries(state.rows.byId)) {
      if (key !== rowId)
        elementIdsToRemove.filter(
          (potential) => !value.elements.includes(potential)
        );
    }
    /* Now remove these elements from state */
    elementIdsToRemove.forEach((ei) => {
      delete state.elements.byId[ei];

      // If we just removed the element acting as the index, reset the state indexElement
      if (state.indexElement === ei) {
        state.indexElement = null;
      }
    });
    state.elements.allIds = state.elements.allIds.filter(
      (ei) => !elementIdsToRemove.includes(ei)
    );
  }

  /* Delete the row if no elements (i.e. last one was removed) */
  if (rowElements.length === 0) {
    delete state.rows.byId[rowId];
    state.rows.allIds = state.rows.allIds.filter((ri) => ri !== rowId);
  } else {
    /* Otherwise, update the row's 'elements' key with fresh element ID's */
    state.rows.byId[rowId].elements = rowElements.map((re) => re.id);
    /* Finally, add or update the new elements */
    for (const re of rowElements) {
      state.elements.byId[re.id] = re;
      state.elements.allIds.indexOf(re.id) === -1 &&
        state.elements.allIds.push(re.id);
    }
  }
};

const _updateRowFillHeight = (state, { payload }) => {
  state.rows.byId[payload.rowId].fillHeight = payload.fillHeight;
};

const _updateIndexElement = (state, { payload }) => {
  state.indexElement = payload || null;
};

export const templateEditorSlice = createSlice({
  name: "templateEditor",
  initialState: {
    ...DefaultTemplate.template(),
  },
  reducers: {
    addTemplateRow: _addRow,
    swapTemplateRows: _swapRows,
    updateTemplateRowHeight: _updateRowHeight,
    updateTemplateRowElements: _updateRowElements,
    updateTemplateRowFillHeight: _updateRowFillHeight,
    updateIndexElement: _updateIndexElement,
  },
});

// Action creators are generated for each case reducer function
export const {
  addTemplateRow,
  swapTemplateRows,
  updateTemplateRowHeight,
  updateTemplateRowElements,
  updateTemplateRowFillHeight,
  updateIndexElement,
} = templateEditorSlice.actions;

export default templateEditorSlice.reducer;

/* Helpers */
const findByElementID = (testArray, id) => {
  if (!Array.isArray(testArray)) {
    throw new Error("Not an array");
  }
  return testArray.findIndex((el) => el.id === id);
};
