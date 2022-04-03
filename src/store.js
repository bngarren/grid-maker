import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import templateEditorReducer from "./domains/Template/templateEditorSlice";
import gridStateReducer from "./global/gridStateSlice";
import gridEditorReducer, {
  gridEditorMiddleware,
} from "./domains/Update/gridEditorSlice";

const reducers = combineReducers({
  templateEditor: templateEditorReducer,
  gridState: gridStateReducer,
  gridEditor: gridEditorReducer,
});

/* Using redux-persist to save store to local storage
See: https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["gridEditor"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  /* https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(gridEditorMiddleware),
});
