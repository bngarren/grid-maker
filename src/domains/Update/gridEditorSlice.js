import { createSlice } from "@reduxjs/toolkit";

const _updateSelectedGDO = (state, { payload }) => {
  state.selectedGDO = payload.id;
};
export const gridEditorSlice = createSlice({
  name: "gridEditor",
  initialState: {
    selectedGDO: null,
  },
  reducers: {
    updateSelectedGDO: _updateSelectedGDO,
  },
});

export const { updateSelectedGDO } = gridEditorSlice.actions;

export default gridEditorSlice.reducer;
