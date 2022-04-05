import {
  createSlice,
  createListenerMiddleware,
  CaseReducer,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { updateGridDataObject } from "../../global/gridStateSlice";
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

// Listener Middleware - used to listen to updateGridDataObject actions from gridStateslice
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
export const { middleware: gridEditorMiddleware } = listenerMiddleware;
