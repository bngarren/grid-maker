import { IconButton, Radio, TableCell, TablePagination } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { styled } from "@mui/material/styles";

interface StyledFlags {
  isSelected?: boolean;
  component?: string;
}

export const StyledTableCellHeader = styled(TableCell, {
  name: "TableGridDataObjects",
  slot: "header",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: "4px",
  borderBottom: "none",
  textAlign: "center",
}));

export const StyledTableCell = styled(TableCell, {
  name: "TableGridDataObjects",
  slot: "tableCell",
  shouldForwardProp: (prop) => prop !== "isSelected",
})<StyledFlags>(({ isSelected, component, theme }) => ({
  [theme.breakpoints.up("lg")]: {
    padding: "3px 6px 3px 6px",
  },
  [theme.breakpoints.down("lg")]: {
    padding: "2px 4px 2px 4px",
  },
  // Targets the Location table cell, when selected
  ...(isSelected &&
    component === "th" && {
      transition: "color 0.1s linear",
      color: theme.palette.secondary.dark,
    }),
}));

export const StyledRadioButton = styled(Radio, {
  name: "TableGridDataObjects",
  slot: "radio",
})(({ theme }) => ({
  "& .MuiSvgIcon-root[data-testid='RadioButtonCheckedIcon']": {
    fill: theme.palette.secondary.dark,
  },
}));

export const StyledTablePagination = styled(TablePagination, {
  name: "TableGridDataObjects",
  slot: "pagination",
})(({ theme }) => ({
  "& .MuiTablePagination-root": {
    overflow: "hidden",
    padding: 0,
  },
  "& .MuiTablePagination-toolbar": {
    paddingLeft: "5px",
    justifyContent: "center",
  },
  "& .MuiTablePagination-spacer": {
    flex: "none",
  },
  "& .MuiTablePagination-input": {
    marginRight: "15px",
  },
  "& .MuiInputBase-root": {
    [theme.breakpoints.down("lg")]: {
      marginRight: "10px",
    },
  },
}));

export const StyledActionsDiv = styled("div", {
  name: "TableGridDataObjects",
  slot: "actions",
})(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
}));

export const buttonPaddingSx = {
  padding: {
    xs: "3px",
    md: "5px",
  },
} as const;

export const StyledMenuIconButton = styled(IconButton)(() => ({}));

export const menuIconStyle = {
  cursor: "pointer",
  fontSize: "1.5rem",
} as const;

export const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

export const StyledMenuOpenIcon = styled(MenuOpenIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));
