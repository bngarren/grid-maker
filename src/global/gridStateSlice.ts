import {
  CaseReducer,
  createSlice,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import {
  GridState,
  GridTemplate,
  GridDataObject,
  GridDataObjectId,
  GridDataObjectElement,
  FormElementValues,
} from "./gridState.types";
import testGridState from "./testGridState";

/**
 * This function will use the current template to update a given gridDataObject's elements.
 * Notably, elements that no longer exist in the template will be dropped. Elements that exist
 * in the template as well as the GDO will be updated (e.g. the element name has been changed).
 * The GDO's indexElementValue is reset (in case the template index element has changed)
 */
const _mergeTemplateWithGridDataObject = (
  template: GridTemplate,
  gdo: GridDataObject
) => {
  const newGDOElements = [];
  let newIndexElementValue = "";
  for (const [, row] of Object.entries(template.rows.byId)) {
    for (const elId of row.elements) {
      const gdoElement = gdo.elements.find((el) => el.id === elId);

      const newValue = gdoElement ? gdoElement.value : "";
      /* Base new elements off the template, but keep what we want from prior GDO element */
      newGDOElements.push({
        id: elId,
        name: template.elements.byId[elId].name,
        value: newValue,
      });

      /* If this element is being used as the index, save its value so
        that it can be stored at the top level of gridDataObject for quick reference */
      if (template.indexElement === elId) {
        newIndexElementValue = newValue;
      }
    }
  }
  gdo.indexElementValue = newIndexElementValue;
  gdo.elements = newGDOElements;
};

/**
 * This function will use the current template to update each gridDataObject's elements.
 * //* We are enforcing "template" as the schema for the elements of each gridDataObject
 * @param {Object} state
 */
const _mergeTemplateWithGridData = (state: GridState) => {
  /* Loop through each GDO in state --> Update or add each of the GDO's elements to match the template */
  state.gridData.forEach((gdo) => {
    _mergeTemplateWithGridDataObject(state.template, gdo);
  });
};

const _updateTemplate: CaseReducer<GridState, PayloadAction<GridTemplate>> = (
  state,
  { payload }
) => {
  state.template = { ...state.template, ...payload };

  _mergeTemplateWithGridData(state);
};

/**
 * Receives a new gridDataObject with default data, including an indexElementValue.
 * //* Must ensure that the index element of this GDO is initially set with this value.
 * @param payload The new gridDataObject
 */
const _addGridDataObject: CaseReducer<
  GridState,
  PayloadAction<GridDataObject>
> = (state, { payload }) => {
  const newIndexElementValue = payload.indexElementValue;
  // add new GDO to gridData
  const length = state.gridData.push({
    ...payload,
  });
  // make this new GDO conform to the template
  _mergeTemplateWithGridDataObject(state.template, state.gridData[length - 1]);

  // Get the GDO back
  const gdo = state.gridData.find((f) => f.id === payload.id);

  // The only element that gets a preset value is the element representing the index,
  // which we obtained from the user's input somewhere in the app
  const indexElement = gdo?.elements.findIndex(
    (f) => f.id === state.template.indexElement
  );
  if (gdo && indexElement != null && indexElement !== -1) {
    gdo.elements[indexElement].value = newIndexElementValue;
    gdo.indexElementValue = newIndexElementValue;
  } else {
    throw new Error(
      "Error within _addGridDataObject attempting to update indexElementValue"
    );
  }
};

const _clearGridDataObject: CaseReducer<
  GridState,
  PayloadAction<{ gdoId: GridDataObjectId }>
> = (state, { payload }) => {
  const gdo = state.gridData.find((g) => g.id === payload.gdoId);
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
  PayloadAction<{ gdoId: GridDataObjectId }>
> = (state, { payload }) => {
  const indexToDelete = state.gridData.findIndex((g) => g.id === payload.gdoId);
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
      if (payload.formElementValues[el.id] != null) {
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
