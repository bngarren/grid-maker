import { createSlice, current } from "@reduxjs/toolkit";
import testGridState from "./testGridState";

/* Grid State schema

state = {

  template:
  gridData:

}

*/

const _updateTemplate = (state, { payload }) => {
  state.template = { ...state.template, ...payload };

  _mergeTemplateWithGridData(state);
};

/**
 * This function will use the current template to update each gridDataObject's elements
 * @param {Object} state
 */
const _mergeTemplateWithGridData = (state) => {
  /* Loop through each GDO --> Update or add each of the GDO's elements to match the template */
  state.gridData.forEach((gdo) => {
    let newGDOElements = [];
    let newIndexElementValue = "";
    for (let [, row] of Object.entries(state.template.rows.byId)) {
      for (let elId of row.elements) {
        let gdoElement = gdo.elements.find((el) => el.id === elId);

        let newValue = gdoElement ? gdoElement.value : "";
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

const _addGridDataObject = (state, { payload }) => {
  state.gridData.push({
    ...payload,
  });
  _mergeTemplateWithGridData(state);
};

const _clearGridDataObject = (state, { payload }) => {
  let gdo = state.gridData.find((g) => g.id === payload.id);
  if (gdo) {
    gdo.elements.forEach((el) => {
      if (el.id !== state.template.indexElement) {
        el.value = "";
      }
    });
  }
};

const _deleteGridDataObject = (state, { payload }) => {
  const indexToDelete = state.gridData.findIndex((g) => g.id === payload.id);
  if (indexToDelete !== -1) {
    state.gridData.splice(indexToDelete, 1);
  }
};

const _updateGridDataObject = (state, { payload }) => {
  // Find the GDO currently in state
  const stateGDO = state.gridData.find((f) => f.id === payload.gdoId);

  if (stateGDO) {
    // Loop through each element and update the element if it
    // was included in the payload
    stateGDO.elements.forEach((el) => {
      if (payload.elementValues[el.id]) {
        el.value = payload.elementValues[el.id];

        // Update the GDO's indexElementValue, if necessary, i.e.
        // the index element's value was changed
        if (state.template.indexElement === el.id) {
          stateGDO.indexElementValue = payload.elementValues[el.id];
        }
      }
    });
  }
};

export const gridStateSlice = createSlice({
  name: "gridState",
  initialState: {
    ...testGridState,
  },
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
