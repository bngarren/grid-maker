import {
  createSlice,
  current,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { updateGridDataObject } from "../../global/gridStateSlice";

const _updateSelectedGDO = (state, { payload }) => {
  state.selectedGDO = payload;

  if (state.selectedGDO != null) {
    // Reset defaultFormValues
    const newDefaultFormValues = {};
    for (const el of state.selectedGDO.elements) {
      newDefaultFormValues[el.id] = el.value;
    }
    state.defaultFormValues = newDefaultFormValues;
  }
};

// Listener Middleware - used to listen to updateGridDataObject actions from gridStateslice
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: updateGridDataObject,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      updateSelectedGDO(
        listenerApi
          .getState()
          .gridState.gridData.find((f) => f.id === action.payload.gdoId)
      )
    );
  },
});

export const { middleware: gridEditorMiddleware } = listenerMiddleware;

export const gridEditorSlice = createSlice({
  name: "gridEditor",
  initialState: {
    selectedGDO: null,
    defaultFormValues: {},
  },
  reducers: {
    updateSelectedGDO: _updateSelectedGDO,
  },
});

export const { updateSelectedGDO } = gridEditorSlice.actions;

export default gridEditorSlice.reducer;
