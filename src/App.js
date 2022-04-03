import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Redux
import store from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Theme
import { ThemeProvider } from "@mui/material/styles";
import theme from "./global/Theme";

// Settings
import { SettingsProvider } from "./global/Settings";

// Components
import { Header, Footer, PageRouter, DialogProvider } from "./components";

// Routing
import { BrowserRouter } from "react-router-dom";

// Firebase
import { Firebase } from "./api/Firebase";
import { config } from "./api/credentials";
import AuthStateProvider from "./global/AuthState";

const fb = new Firebase({ ...config });

let persistor = persistStore(store);

function App() {
  return (
    <div className="app">
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SettingsProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthStateProvider Firebase={fb}>
                <DialogProvider>
                  <BrowserRouter>
                    <Container maxWidth="xl">
                      <Header />
                      <main>
                        <PageRouter />
                      </main>
                    </Container>
                    <Footer />
                  </BrowserRouter>
                </DialogProvider>
              </AuthStateProvider>
            </ThemeProvider>
          </SettingsProvider>
        </PersistGate>
      </ReduxProvider>
    </div>
  );
}

export default App;
