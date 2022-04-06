import {
  createSlice,
  createListenerMiddleware,
  CaseReducer,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  updateGridDataObject,
  deleteGridDataObject,
} from "../../global/gridStateSlice";
import {
  GridDataObject,
  FormElementValues,
} from "../../global/gridState.types";

interface GridEditor {
  selectedGDO: GridDataObject | null;
  defaultFormValues: FormElementValues;
  isDirty: boolean;
}

const _updateSelectedGDO: CaseReducer<
  GridEditor,
  PayloadAction<GridDataObject | null>
> = (state, { payload }) => {
  state.selectedGDO = payload;

  if (state.selectedGDO != null) {
    // Reset defaultFormValues
    const newDefaultFormValues: FormElementValues = {};
    for (const el of state.selectedGDO.elements) {
      newDefaultFormValues[el.id] = el.value;
    }
    state.defaultFormValues = newDefaultFormValues;
  }
};

const _setDirty: CaseReducer<GridEditor, PayloadAction<boolean>> = (
  state,
  { payload }
) => {
  state.isDirty = payload;
};

export const gridEditorSlice = createSlice({
  name: "gridEditor",
  initialState: {
    selectedGDO: null,
    defaultFormValues: {},
    isDirty: false,
  } as GridEditor,
  reducers: {
    updateSelectedGDO: _updateSelectedGDO,
    setDirty: _setDirty,
  },
});

export const { updateSelectedGDO, setDirty } = gridEditorSlice.actions;

export default gridEditorSlice.reducer;

// Listener Middleware - used to listen to actions from gridStateslice
const listenerMiddleware = createListenerMiddleware();

// Since selectedGDO tracks the same GDO as in gridState, we
// must update selectedGDO's data when it changes in gridState
listenerMiddleware.startListening({
  actionCreator: updateGridDataObject,
  effect: async (action, listenerApi) => {
    const gs = listenerApi.getState() as RootState;
    // Only update selectedGDO if the observed action was an
    // update to this GDO
    gs.gridEditor.selectedGDO?.id === action.payload.gdoId &&
      listenerApi.dispatch(
        updateSelectedGDO(
          gs.gridState.gridData.find((f) => f.id === action.payload.gdoId) ??
            null
        )
      );
  },
});

// This state's selectedGDO should be set to null if the represented GDO has been deleted
listenerMiddleware.startListening({
  actionCreator: deleteGridDataObject,
  effect: async (action, listenerApi) => {
    const gs = listenerApi.getState() as RootState;
    // Only nullify selectedGDO if the observed action was an
    // delete action to this GDO
    gs.gridEditor.selectedGDO?.id === action.payload.gdoId &&
      listenerApi.dispatch(updateSelectedGDO(null));
  },
});
export const { middleware: gridEditorMiddleware } = listenerMiddleware;
