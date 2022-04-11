import {
  createSlice,
  CaseReducer,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  GridTemplate,
  TemplateElement,
  TemplateElementId,
  TemplateRow,
  TemplateRowId,
} from "../../global/gridState.types";
import DefaultTemplate from "./GenerateDefaultTemplate";

// Types

/**
 * TemplateEditorState is almost the same as GridTemplate interface (becuase this
 * is what we are building) but does allow indexElement to be undefined or null
 */
interface TemplateEditorState extends Omit<GridTemplate, "indexElement"> {
  indexElement?: TemplateElementId | null;
}

const initialState: TemplateEditorState = {
  ...DefaultTemplate.template(),
};

const _setTemplate: CaseReducer<
  TemplateEditorState,
  PayloadAction<TemplateEditorState>
> = (state, { payload }) => {
  return payload;
};

const _addRow: CaseReducer<TemplateEditorState> = (state) => {
  const newElement = {
    ...DefaultTemplate.element(),
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

const _swapRows: CaseReducer<
  TemplateEditorState,
  PayloadAction<TemplateRowId>
> = (state, { payload }) => {
  const rowId = payload;
  const rowIndex = state.rows.allIds.indexOf(rowId);
  if (state.rows.allIds[rowIndex + 1] != null) {
    const newRows = [...state.rows.allIds];
    // https://stackoverflow.com/a/59398737
    [newRows[rowIndex + 1], newRows[rowIndex]] = [
      newRows[rowIndex],
      newRows[rowIndex + 1],
    ];
    state.rows.allIds = newRows;
  }
};

const updateRowFillHeight = (
  state: TemplateEditorState,
  {
    rowId,
    fillHeight,
  }: { rowId: TemplateRowId } & Pick<TemplateRow, "fillHeight">
) => {
  state.rows.byId[rowId].fillHeight = fillHeight;
};

const _updateRowElements: CaseReducer<
  TemplateEditorState,
  PayloadAction<{ rowId: TemplateRowId; rowElements: TemplateElement[] }>
> = (state, { payload }) => {
  const rowId = payload.rowId;
  const rowElements = payload.rowElements;

  const prevElements = [...state.rows.byId[rowId].elements];

  /* Next, check to see if this row's 'elements' array has dropped some elementID's
  since last state, and check if they are used elsewhere (in other rows). If not, we will remove them. */

  // First, see which elementIDs are missing compared to previous state of row
  const elementIdsToRemove = prevElements.filter(
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
  } /* Otherwise, update the row's 'elements' key with fresh element ID's */ else {
    state.rows.byId[rowId].elements = rowElements.map((re) => re.id);
    /* Finally, add or update the new elements */
    for (const re of rowElements) {
      state.elements.byId[re.id] = re; //Add or update the byId object
      state.elements.allIds.indexOf(re.id) === -1 &&
        state.elements.allIds.push(re.id); // Add ids to allIds that aren't currently present
    }
  }

  // Update the row's fill Height
  /* If there is only 1 element on the row and the element type is "text_multiline", make the row height expand, i.e fillHeight = true
  If there is more than 1 element on the row, the fillHeight is always false
   */
  // If row still exists (could have been deleted above)
  if (state.rows.byId[rowId] != null) {
    let newFillHeight: boolean;
    if (state.rows.byId[rowId].elements.length === 1) {
      if (
        state.elements.byId[state.rows.byId[rowId].elements[0]].type ===
        "text_multiline"
      ) {
        newFillHeight = true;
      } else {
        newFillHeight = false;
      }
    } else {
      newFillHeight = false;
    }
    updateRowFillHeight(state, {
      rowId: rowId,
      fillHeight: newFillHeight,
    });
  }
};

const _updateIndexElement: CaseReducer<
  TemplateEditorState,
  PayloadAction<TemplateElementId | null> // allow null only in TemplateEditor
> = (state, { payload }) => {
  state.indexElement = payload;
};

export const templateEditorSlice = createSlice({
  name: "templateEditor",
  initialState: initialState,
  reducers: {
    setTemplate: _setTemplate,
    addTemplateRow: _addRow,
    swapTemplateRows: _swapRows,
    updateTemplateRowElements: _updateRowElements,
    updateIndexElement: _updateIndexElement,
  },
});

// Action creators are generated for each case reducer function
export const {
  setTemplate,
  addTemplateRow,
  swapTemplateRows,
  updateTemplateRowElements,
  updateIndexElement,
} = templateEditorSlice.actions;

export default templateEditorSlice.reducer;

/* Helpers */
function findByElementID(testArray: TemplateElement[], id: TemplateElementId) {
  if (!Array.isArray(testArray)) {
    throw new Error("Not an array");
  }
  return testArray.findIndex((el) => el.id === id);
}
