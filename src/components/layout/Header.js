import { useState, cloneElement } from "react";

// MUI
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useScrollTrigger,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material";
import { styled } from "@mui/system";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GetAppIcon from "@mui/icons-material/GetApp";
import ViewListIcon from "@mui/icons-material/ViewList";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";

// Logo
import { ReactComponent as Logo } from "../../assets/logo_color.svg";

// lodash
import { uniqueId } from "lodash-es";

// React Router
import { useMatch, useNavigate } from "react-router-dom";

// Context
import { useAuthStateContext } from "../../global/AuthState";
import { useSettings } from "../../global/Settings";

// hooks
import usePdfMaker from "../../domains/Document/usePdfMaker";

// Login
import { useLoginDialog } from "../../domains/Login/useLoginDialog";

// Exporter
import Exporter from "../../domains/IO/Exporter";

/* Used to make the App Bar add elevation when the page is scrolled */
const ElevationScroll = ({ children }) => {
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return cloneElement(children, {
    elevation: scrollTrigger ? 2 : 0,
  });
};

/* Styling */

const StyledHeaderMenuBox = styled(Box, {
  name: "StyledHeaderMenuBox",
})(() => ({
  display: "flex",
  flexGrow: 1,
}));

const Header = () => {
  const navigate = useNavigate();

  const { showLogin, LoginDialog } = useLoginDialog();

  const { getPdf } = usePdfMaker();

  const handleClickLogin = () => {
    showLogin((prevValue) => !prevValue);
  };

  /* Take us home on Logo click */
  const handleClickLogo = () => {
    navigate("/");
  };

  return (
    <>
      <ElevationScroll>
        <AppBar
          sx={{
            backgroundColor: "white",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              justifyContent: "center",
              p: 0,
            }}
          >
            <Box
              onClick={handleClickLogo}
              sx={{
                display: "flex",
                flexDirection: "row",
                color: "black",
                paddingRight: "15px",
                cursor: "pointer",
              }}
            >
              <Logo width="175px" />
            </Box>
            <StyledHeaderMenuBox
              sx={{
                justifyContent: {
                  xs: "flex-end",
                  md: "center",
                },
              }}
            >
              <HeaderMenu
                onClickLogin={handleClickLogin}
                onDownloadPdf={getPdf}
              />
            </StyledHeaderMenuBox>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      {LoginDialog}
    </>
  );
};

/* Styling */

const StyledListItemText = styled(ListItemText)(() => ({
  fontSize: "1rem",
}));

/* StyledIconButton's are used in the expanded menu across the top */
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: "6px",
  borderRadius: "3px",
  "&.Mui-disabled": {
    border: `1px solid ${alpha(theme.palette.primary.light, 0.08)}`,
    color: theme.palette.secondary.dark,
  },
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

/* HeaderMenu contains the links. Can either be expanded or collapsed, depending on
screen size. */
const HeaderMenu = ({ onClickLogin = (f) => f, onDownloadPdf = (f) => f }) => {
  const { userIsLoggedIn, signOut } = useAuthStateContext();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    onClickLogin();
    handleClose();
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  const handleOnExported = () => {
    handleClose();
  };

  const handleDownloadPdf = () => {
    onDownloadPdf();
    handleClose();
  };

  const handleEdit = () => {
    handleClose();
    navigate("/update");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const exportFilename = settings.export_filename
    ? settings.export_filename
    : "grid";

  const loggedInMenuCondensed = [
    /* Note that we disable the eslint checking for each element in an array
    having a 'key', because we do this programatically later on */
    /*eslint-disable react/jsx-key*/
    <MenuItem onClick={handleEdit} disabled={Boolean(useMatch("/update"))}>
      <ListItemIcon>
        <WysiwygIcon />
      </ListItemIcon>
      <StyledListItemText>Edit Grid</StyledListItemText>
    </MenuItem>,
    <MenuItem
      onClick={handleSettings}
      disabled={Boolean(useMatch("/settings"))}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <StyledListItemText>Settings</StyledListItemText>
    </MenuItem>,
    <Divider />,
    <MenuItem onClick={handleDownloadPdf}>
      <ListItemIcon>
        <PictureAsPdfIcon />
      </ListItemIcon>
      <StyledListItemText>Download PDF</StyledListItemText>
    </MenuItem>,
    <Exporter onExported={handleOnExported} filename={exportFilename}>
      <MenuItem>
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        <StyledListItemText>Export Grid</StyledListItemText>
      </MenuItem>
    </Exporter>,
    <Divider />,
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <StyledListItemText>Logout</StyledListItemText>
    </MenuItem>,
    /*eslint-enable */
  ];

  const loggedOutMenuCondensed = [
    /*eslint-disable react/jsx-key*/
    <MenuItem onClick={handleLogin}>
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <StyledListItemText>Login</StyledListItemText>
    </MenuItem>,
    /*eslint-enable */
  ];

  const loggedInMenuExpanded = [
    /*eslint-disable react/jsx-key*/
    <Tooltip title="Edit Grid" placement="bottom">
      <span>
        {/* Surround with <span> so that tooltip still works when button is disabled, per MUI */}
        <StyledIconButton
          onClick={handleEdit}
          disabled={Boolean(useMatch("/update"))}
        >
          <WysiwygIcon />
        </StyledIconButton>
      </span>
    </Tooltip>,
    <Tooltip title="Settings" placement="bottom">
      <span>
        <StyledIconButton
          onClick={handleSettings}
          disabled={Boolean(useMatch("/settings"))}
        >
          <SettingsIcon />
        </StyledIconButton>
      </span>
    </Tooltip>,
    <Divider orientation="vertical" />,
    <Tooltip title="Download PDF" placement="bottom">
      <StyledIconButton onClick={handleDownloadPdf}>
        <PictureAsPdfIcon />
      </StyledIconButton>
    </Tooltip>,
    <Exporter onExported={handleOnExported} filename={exportFilename}>
      <Tooltip title="Export Grid" placement="bottom">
        <StyledIconButton>
          <GetAppIcon />
        </StyledIconButton>
      </Tooltip>
    </Exporter>,
    <Divider orientation="vertical" />,
    <Tooltip title="Logout" placement="bottom">
      <StyledIconButton onClick={handleLogout}>
        <ExitToAppIcon />
      </StyledIconButton>
    </Tooltip>,
  ];

  const loggedOutMenuExpanded = [
    <Tooltip title="Settings" placement="bottom">
      <StyledIconButton onClick={handleLogin}>
        <AccountBoxIcon />
      </StyledIconButton>
    </Tooltip>,
    /*eslint-disable*/
  ];

  return (
    <>
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
        }}
      >
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{
            color: "primary.dark",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiListItemIcon-root": {
              color: "primary.dark",
            },
            "& .MuiMenuItem-root:hover .MuiListItemIcon-root": {
              color: "primary.main",
            },
          }}
        >
          {userIsLoggedIn
            ? loggedInMenuCondensed.map((i) =>
                cloneElement(i, { key: uniqueId("menuItem-") })
              )
            : loggedOutMenuCondensed.map((i) =>
                cloneElement(i, { key: uniqueId("menuItem-") })
              )}
        </Menu>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "space-between",
          maxWidth: {
            xs: "90%",
            md: "40%",
            lg: "30%",
          },
        }}
      >
        {userIsLoggedIn
          ? loggedInMenuExpanded.map((i) =>
              cloneElement(i, { key: uniqueId("menuItem-") })
            )
          : loggedOutMenuExpanded.map((i) =>
              cloneElement(i, { key: uniqueId("menuItem-") })
            )}
      </Box>
    </>
  );
};

export default Header;
