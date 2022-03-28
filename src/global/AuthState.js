import { createContext, useContext, useState, useEffect } from "react";
import { UNAUTHENTICATED, AUTHENTICATED_ANONYMOUSLY } from "../api/Firebase";

const AuthStateContext = createContext({
  state: UNAUTHENTICATED,
  user: {},
});

// https://dev.to/onurbraga/firebase-authentication-using-react-hooks-50j0

/* Another layer of encapsulation around the class introduced in Firebase.js.
The difference here is that now we are talking about a Provider that will
expose the firebase methods to our whole application */
export default function AuthStateProvider({ children, Firebase }) {
  const [authState, setAuthState] = useState({
    status: UNAUTHENTICATED,
    user: undefined,
  });

  const signOut = () => Firebase.signOut(setAuthState);

  const signUpWithEmailAndPassword = (
    email,
    password,
    name,
    callback,
    onError
  ) => {
    const expandedOnError = (error) => {
      // If there is an error with the login we will rollback to the last auth state.
      setAuthState(authState);
      onError && onError(error);
    };

    Firebase.signUpWithEmailAndPassword(
      email,
      password,
      name,
      setAuthState,
      callback,
      expandedOnError
    );
  };

  const signInWithEmailAndPassword = (email, password, callback, onError) => {
    const expandedOnError = (error) => {
      // If there is an error with the login we will rollback to the last auth state.
      setAuthState(authState);
      onError && onError(error);
    };
    Firebase.signInWithEmailAndPassword(
      email,
      password,
      setAuthState,
      callback,
      expandedOnError
    );
  };

  const signInWithGoogle = (callback) =>
    Firebase.signInWithGoogle(setAuthState, callback);
  const updateEmailAddress = (email, callback) =>
    Firebase.updateEmailAddress(email, callback);
  const sendPasswordResetEmail = (email, callback, onError) =>
    Firebase.sendPasswordResetEmail(email, callback, onError);
  const sendEmailVerification = (callback, onError) =>
    Firebase.sendEmailVerification(callback, onError);
  const userHasOnlyEmailProvider = () => Firebase.userHasOnlyEmailProvider();

  const userIsLoggedIn =
    authState.status !== UNAUTHENTICATED &&
    authState.status !== AUTHENTICATED_ANONYMOUSLY;

  useEffect(() => {
    let unsubscribe = Firebase.authState(setAuthState);
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthStateContext.Provider
      value={{
        authState,
        userIsLoggedIn,
        signOut,
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        updateEmailAddress,
        sendPasswordResetEmail,
        sendEmailVerification,
        userHasOnlyEmailProvider,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
}

export const useAuthStateContext = () => useContext(AuthStateContext);
