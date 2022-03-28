import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  DocumentPage,
  SettingsPage,
  UpdatePage,
  TemplatePage,
} from "../../domains";

// Context
import TemplateEditorProvider from "../../domains/Template/TemplateEditor";

// Authentication
import { useAuthStateContext } from "../../context/AuthState";
import { UNAUTHENTICATED } from "../../api/Firebase";

const PageRouter = () => {
  const { authState } = useAuthStateContext();

  /* Don't try to figure out routes before we've decided if the
  user is logged in or not. Otherwise, they always get sent to the 
  login page */
  if (authState.status !== UNAUTHENTICATED) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* The following routes are "protected", i.e. logged in only */}
        <Route
          path="/update"
          element={
            <RequireAuth>
              <UpdatePage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/template"
          element={
            <RequireAuth>
              <TemplateEditorProvider>
                <TemplatePage />
              </TemplateEditorProvider>
            </RequireAuth>
          }
        />
        <Route
          path="/document"
          element={
            <RequireAuth>
              <DocumentPage />
            </RequireAuth>
          }
        />

        {/* The no match route, i.e. 404 */}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There&#39;s nothing here!</p>
            </main>
          }
        />
      </Routes>
    );
  } else return <></>;
  /* Figuring out if user is logged in or not. Could put a spinner if we wanted... */
};

/* If user is logged in, will show the "protected" child component,
if not, will redirect to the LoginPage */
const RequireAuth = ({ children }) => {
  const { userIsLoggedIn } = useAuthStateContext();
  const location = useLocation();

  if (!userIsLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PageRouter;
