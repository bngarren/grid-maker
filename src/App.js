import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Theme
import { ThemeProvider } from "@mui/material/styles";
import theme from "./context/Theme";

// Settings
import { SettingsProvider } from "./context/Settings";

// Components
import { Header, Footer, PageRouter, DialogProvider } from "./components";

// Routing
import { BrowserRouter } from "react-router-dom";

// Firebase
import { Firebase } from "./api/Firebase";
import { config } from "./api/credentials";
import AuthStateProvider from "./context/AuthState";

// Grid Template system
import TemplateProvider from "./context/Template";

// GridState
import GridStateProvider from "./context/GridState";

const fb = new Firebase({ ...config });

function App() {
  return (
    <div className="app">
      <SettingsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthStateProvider Firebase={fb}>
            <TemplateProvider>
              <GridStateProvider Firebase={fb}>
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
              </GridStateProvider>
            </TemplateProvider>
          </AuthStateProvider>
        </ThemeProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
