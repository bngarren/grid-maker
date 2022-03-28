import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from "@mui/material";

// Context
import { useAuthStateContext } from "../../global/AuthState";

const LoginForm = ({ onLoginSuccess = (f) => f }) => {
  const { signInWithEmailAndPassword } = useAuthStateContext();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    if (inputEmail && inputPassword) {
      setError(null);
      setLoading(true);
      signInWithEmailAndPassword(
        inputEmail,
        inputPassword,
        () => {
          onLoginSuccess();
          setLoading(false);
        },
        (error) => {
          console.log(error);
          setError(error.message);
          setLoading(false);
        }
      );
    }
  };

  return (
    <div>
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
      {loading && <LinearProgress />}
    </div>
  );
};

export const useLoginDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleLoginSuccess = () => {
    setOpen(false);
  };

  const LoginDialog = (
    <Dialog open={open} onClose={handleOnClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </DialogContent>
    </Dialog>
  );

  return { showLogin: setOpen, LoginDialog };
};
