import { createTheme } from "@mui/material/styles";

/* Palette created here: https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=455A64&secondary.color=B2FF59 */

const theme = createTheme({
  mode: "light",
  palette: {
    primary: {
      main: "#455a64",
      light: "#718792",
      dark: "#1c313a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b2ff59",
      light: "#e7ff8c",
      dark: "#7ecb20",
      contrastText: "#000000",
    },
  },
  typography: {
    formFontSizeLevel1: "0.98rem",
    formFontSizeLevel2: "0.90rem",
    formFontSizeLevel3: "0.85rem",
  },
});

theme.shadows.push("0px 11px 10px -12px rgba(0,0,0,0.46)"); // shadow #25 is a soft bottom shadow

export default theme;
