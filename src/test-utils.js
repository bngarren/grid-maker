import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./global/Theme";
import { SettingsProvider } from "./global/Settings";
import GridStateProvider from "./global/GridState";
import { BrowserRouter } from "react-router-dom";
import { Firebase } from "./api/Firebase";
import { config } from "./api/credentials";

// const fb = new Firebase({ ...config });

const AllTheProviders = ({ children }) => {
  return (
    <SettingsProvider>
      <ThemeProvider theme={theme}>
        <GridStateProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </GridStateProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
// eslint-disable-next-line import/export
export * from "@testing-library/react";

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
