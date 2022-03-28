import { useState } from "react";
// React router
import { useNavigate, useLocation } from "react-router-dom";

// Context
import { useAuthStateContext } from "../../global/AuthState";

const LoginPage = () => {
  const { authState, userIsLoggedIn, signInWithEmailAndPassword, signOut } =
    useAuthStateContext();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState(null);

  // React router
  const navigate = useNavigate();
  const location = useLocation();
  /* try to get the location the user was trying to go to before
  getting redirected to login */
  const from = location.state?.from?.pathname || "/";

  const handleLogin = () => {
    if (inputEmail && inputPassword) {
      setError(null);
      signInWithEmailAndPassword(
        inputEmail,
        inputPassword,
        () => {
          // success
          /* Send them back to the page they tried to visit when they were
          redirected to the login page. Use { replace: true } so we don't create
          another entry in the history stack for the login page.  This means that
          when they get to the protected page and click the back button, they
          won't end up back on the login page, which is also really nice for the
          user experience. */
          navigate(from, { replace: true });
        },
        (error) => {
          console.log(error);
          setError(error.message);
        }
      );
    }
  };

  const handleSignOut = () => {
    setInputEmail("");
    setInputPassword("");
    signOut();
  };

  return (
    <div>
      {!userIsLoggedIn ? (
        <div>
          {error && error}
          <label>
            Email
            <input
              type="text"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="text"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
          </label>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <button onClick={handleSignOut}>
          Log out {authState?.user?.displayName}
        </button>
      )}
    </div>
  );
};

export default LoginPage;
