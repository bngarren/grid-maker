import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  GridState,
  GridTemplate,
  GridDataObject,
  GridDataObjectId,
  GridDataObjectElement,
  FormElementValues,
} from "./gridState.types";
import testGridState from "./testGridState";

const _updateTemplate: CaseReducer<GridState, PayloadAction<GridTemplate>> = (
  state,
  { payload }
) => {
  state.template = { ...state.template, ...payload };

  _mergeTemplateWithGridData(state);
};

/**
 * This function will use the current template to update each gridDataObject's elements
 * @param {Object} state
 */
const _mergeTemplateWithGridData = (state: GridState) => {
  /* Loop through each GDO --> Update or add each of the GDO's elements to match the template */
  state.gridData.forEach((gdo) => {
    const newGDOElements = [];
    let newIndexElementValue = "";
    for (const [, row] of Object.entries(state.template.rows.byId)) {
      for (const elId of row.elements) {
        const gdoElement = gdo.elements.find((el) => el.id === elId);

        const newValue = gdoElement ? gdoElement.value : "";
        /* Base new elements off the template, but keep what we want from prior GDO element */
        newGDOElements.push({
          id: elId,
          name: state.template.elements.byId[elId].name,
          value: newValue,
        });

        /* If this element is being used as the index, save its value so
        that it can be stored at the top level of gridDataObject for quick reference */
        if (state.template.indexElement === elId) {
          newIndexElementValue = newValue;
        }
      }
    }
    gdo.indexElementValue = newIndexElementValue;
    gdo.elements = newGDOElements;
  });
};

const _addGridDataObject: CaseReducer<
  GridState,
  PayloadAction<GridDataObject>
> = (state, { payload }) => {
  state.gridData.push({
    ...payload,
  });
  _mergeTemplateWithGridData(state);
};

const _clearGridDataObject: CaseReducer<
  GridState,
  PayloadAction<{ id: GridDataObjectId }>
> = (state, { payload }) => {
  const gdo = state.gridData.find((g) => g.id === payload.id);
  if (gdo) {
    gdo.elements.forEach((el) => {
      if (el.id !== state.template.indexElement) {
        el.value = "";
      }
    });
  }
};

const _deleteGridDataObject: CaseReducer<
  GridState,
  PayloadAction<{ id: GridDataObjectId }>
> = (state, { payload }) => {
  const indexToDelete = state.gridData.findIndex((g) => g.id === payload.id);
  if (indexToDelete !== -1) {
    state.gridData.splice(indexToDelete, 1);
  }
};

const _updateGridDataObject: CaseReducer<
  GridState,
  PayloadAction<{
    gdoId: GridDataObjectId;
    formElementValues: FormElementValues;
  }>
> = (state, { payload }) => {
  // Find the GDO currently in state
  const stateGDO = state.gridData.find((f) => f.id === payload.gdoId);

  if (stateGDO) {
    // Loop through each element and update the element if it
    // was included in the payload
    stateGDO.elements.forEach((el: GridDataObjectElement) => {
      if (payload.formElementValues[el.id]) {
        el.value = payload.formElementValues[el.id];

        // Update the GDO's indexElementValue, if necessary, i.e.
        // the index element's value was changed
        if (state.template.indexElement === el.id) {
          stateGDO.indexElementValue = payload.formElementValues[el.id];
        }
      }
    });
  }
};

export const gridStateSlice = createSlice({
  name: "gridState",
  initialState: {
    ...testGridState,
  } as GridState,
  reducers: {
    updateTemplate: _updateTemplate,
    addGridDataObject: _addGridDataObject,
    clearGridDataObject: _clearGridDataObject,
    deleteGridDataObject: _deleteGridDataObject,
    updateGridDataObject: _updateGridDataObject,
  },
});

export const {
  updateTemplate,
  addGridDataObject,
  clearGridDataObject,
  deleteGridDataObject,
  updateGridDataObject,
} = gridStateSlice.actions;

export default gridStateSlice.reducer;
