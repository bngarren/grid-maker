import { version } from "../../../package.json";
import { Link } from "react-router-dom";

// MUI
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

// Logo
import { ReactComponent as LogoBox } from "../../assets/logo_box_desaturated.svg";
import { ReactComponent as LogoText } from "../../assets/logo_text.svg";

// Context
import { useAuthStateContext } from "../../global/AuthState";

// Login
import { useLoginDialog } from "../../domains/Login/useLoginDialog";

const StyledButtonLink = styled(`button`)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  background: "none!important",
  border: "none",
  padding: "0 !important",
  color: theme.palette.secondary.dark,
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "0.85rem",
}));

const Footer = () => {
  const { userIsLoggedIn, signOut } = useAuthStateContext();
  const { showLogin, LoginDialog } = useLoginDialog();

  const handleLogin = () => {
    showLogin((prevValue) => !prevValue);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Box
      sx={{
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          fontSize: "0.85rem",
          padding: "10px 0px",
          margin: "20vh auto 5px auto",
          maxWidth: {
            xs: "90vw",
            sm: "70vw",
            md: "60vw",
            lg: "50vw",
            xl: "35vw",
          },
          "& a": {
            color: "primary.main",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <LogoBox width="125px" style={{ opacity: "0.2" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Link to={{ pathname: "/update" }}>Edit</Link>
              <Link to={{ pathname: "/settings" }}>Settings</Link>
              <Link to={{ pathname: "/document" }}>Document</Link>
            </Box>
            <Box>
              {userIsLoggedIn ? (
                <StyledButtonLink onClick={handleLogout}>
                  Logout
                </StyledButtonLink>
              ) : (
                <StyledButtonLink onClick={handleLogin}>Login</StyledButtonLink>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <LogoText
            width="100px"
            style={{ opacity: "0.6", marginRight: "5px" }}
          />
          <Typography variant="caption" sx={{ mr: 1 }}>
            v{version}
          </Typography>
          <Typography variant="caption">&copy; 2022</Typography>
        </Box>
        {LoginDialog}
      </Box>
    </Box>
  );
};

export default Footer;
