import { createContext, useReducer, useContext, useEffect } from "react";

import { DEFAULT_SETTINGS } from "../utils";

const SettingsContext = createContext();

const settingsReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);

  /* Load settings from local storage */
  useEffect(() => {
    const data = localStorage.getItem("settings");

    dispatch({
      type: "UPDATE",
      payload: JSON.parse(data),
    });
  }, []);

  /* When state changes, save to local storage */
  useEffect(() => {
    if (state != null) {
      const dataToSave = JSON.stringify(state);
      localStorage.setItem("settings", dataToSave);
    }
  }, [state]);

  const value = { settings: state, dispatchSettings: dispatch };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettings must be consumed within a SettingsProvider component."
    );
  }
  return context;
};

export { SettingsProvider, useSettings };
