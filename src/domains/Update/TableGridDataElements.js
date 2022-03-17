import { useState, useEffect, useContext, memo } from "react";

// MUI
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Typography,
  Paper,
  Radio,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { styled } from "@mui/system";

// Router
import { Link } from "react-router-dom";

// Utility
import { isGridDataElementEmpty, APP_TEXT } from "../../utils";

// Popover
import { usePopupState } from "material-ui-popup-state/hooks";
import ActionsPopover from "./ActionsPopover";

// Components
import AddNewGridDataElementForm from "./AddNewGridDataElementForm";

// Context
import GridDataElementActionsContext from "./GridDataElementActionsContext";

// Defaults //TODO Need to put this in Settings
const ROWS_PER_PAGE = 15;

/* Styling */
const StyledTableCellHeader = styled(TableCell, {
  name: "TableGridDataElements",
  slot: "header",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: "4px",
  borderBottom: "none",
  textAlign: "center",
}));

const StyledTableCell = styled(TableCell, {
  name: "TableGridDataElements",
  slot: "tableCell",
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ isSelected, component, theme }) => ({
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
      backgroundColor: theme.palette.primary.main,
    }),
}));

const StyledTypographyLocation = styled(Typography, {
  name: "TableGridDataElements",
  slot: "location",
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ isSelected, theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  ...(isSelected && {
    color: theme.palette.secondary.light,
  }),
}));

const StyledTypographyPatientName = styled(Typography, {
  name: "TableGridDataElements",
  slot: "patientName",
})(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    fontSize: "0.95rem",
  },
  [theme.breakpoints.down("lg")]: {
    fontSize: "0.90rem",
  },
}));

const StyledTablePagination = styled(TablePagination, {
  name: "TableGridDataElements",
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

const StyledActionsDiv = styled("div", {
  name: "TableGridDataElements",
  slot: "actions",
})(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
}));

const buttonPaddingSx = {
  padding: {
    xs: "3px",
    md: "5px",
  },
};

const StyledMenuIconButton = styled(IconButton)(() => ({}));

const menuIconStyle = {
  cursor: "pointer",
  fontSize: "1.5rem",
};

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const StyledMenuOpenIcon = styled(MenuOpenIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const TableGridDataElements = ({ data, selectedKey }) => {
  // table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /* Watches for changes in selectedKey and picks the correct paginated page that contains
  that gridDataElement. E.g. when using the navigation arrows and you move to a gridDataElement that is on
  a different paginated page */
  useEffect(() => {
    // Page should be set so that selectedKey is within range of [page*rowsPerPage, rowsPerPage + rowsPerPage - 1]
    const rowsTotal = data.length;
    const numOfPage = Math.ceil(rowsTotal / rowsPerPage);
    let newPage = 0;
    for (let i = 0; i < numOfPage; i++) {
      // loop through available pages
      if (
        selectedKey >= i * rowsPerPage &&
        selectedKey <= i * rowsPerPage + rowsPerPage - 1
      ) {
        newPage = i;
      }
    }
    setPage(newPage);
  }, [selectedKey, data.length, rowsPerPage]);

  const columnSizes = {
    location: getLocationCharSize(data),
    team: getTeamCharSize(data),
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table of items" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          {data?.length !== 0 ? (
            <TableRow data-testid="header row with info">
              <StyledTableCellHeader
                sx={{
                  width: `${columnSizes.location * 1.7}ch`,
                }}
              >
                Location
              </StyledTableCellHeader>
              <StyledTableCellHeader>{/* Name */}</StyledTableCellHeader>
              <StyledTableCellHeader
                sx={{ width: `${columnSizes.team * 1.5}ch` }}
              >
                <Tooltip title="Team" placement="top">
                  <GroupIcon sx={{ verticalAlign: "middle" }} />
                </Tooltip>
              </StyledTableCellHeader>
              <StyledTableCellHeader sx={{ width: "80px" }} />
            </TableRow>
          ) : (
            <TableRow data-testid="header row without info">
              <StyledTableCellHeader colSpan={4} />
            </TableRow>
          )}
        </TableHead>
        <MyTableBody
          data={data}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
          columnSizes={columnSizes}
        />
      </Table>
      <StyledTablePagination
        rowsPerPageOptions={[5, 15, 30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        variant="footer"
      />
    </TableContainer>
  );
};

const MyTableBody = ({ data, page, rowsPerPage, selectedKey, columnSizes }) => {
  const MyInputTableRow = (
    <TableRow>
      <StyledTableCell component="th" scope="row" align="right" colSpan={4}>
        <AddNewGridDataElementForm />
      </StyledTableCell>
    </TableRow>
  );

  return (
    <>
      <TableBody>
        {data?.length !== 0 ? (
          data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((value, key) => {
              let adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
              const isSelected = adjustedKey === selectedKey;

              return (
                <MyTableRow
                  adjustedKey={adjustedKey}
                  isSelected={isSelected}
                  key={`MyTableRow-${value.id}`}
                  value={value}
                  columnSizes={columnSizes}
                />
              );
            })
        ) : (
          <TableRow>
            <TableCell scope="row" colSpan={4}>
              {APP_TEXT.addFirstGridDataElementPrompt}
              <Link to="/settings">{APP_TEXT.createLayoutLink}</Link>
            </TableCell>
          </TableRow>
        )}
        {MyInputTableRow}
      </TableBody>
    </>
  );
};

const MyTableRow = memo(function MyTableRow({
  adjustedKey,
  isSelected,
  value,
  columnSizes,
}) {
  const isEmptyGridDataElement = isGridDataElementEmpty(value);

  const getPatientName = () => {
    if (value == null) return "";
    const lastName = value.lastName || "";
    const firstName = value.firstName || "";
    return `${lastName}${lastName && firstName && ", "}${firstName}`;
  };

  return (
    <TableRow key={value.id} hover selected={isSelected}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        isSelected={isSelected}
      >
        <StyledTypographyLocation
          aria-label="heading for location"
          variant="h6"
          isSelected={isSelected}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: columnSizes.location > 3 ? "0.90rem" : "1rem",
          }}
        >
          {value.location}
        </StyledTypographyLocation>
      </StyledTableCell>
      <StyledTableCell align="left" isSelected={isSelected}>
        <StyledTypographyPatientName
          variant="body1"
          sx={{
            fontWeight: isSelected ? "fontWeightBold" : "fontWeightRegular",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {getPatientName()}
        </StyledTypographyPatientName>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: columnSizes.team > 4 && "0.85rem",
          }}
        >
          {value.team}
        </Typography>
      </StyledTableCell>
      <StyledTableCell>
        <GridDataElementActions
          isSelected={isSelected}
          location={value.location}
          gridDataElementKey={adjustedKey}
          isEmptyGridDataElement={isEmptyGridDataElement}
        />
      </StyledTableCell>
    </TableRow>
  );
});

const GridDataElementActions = memo(function GridDataElementActions({
  isSelected,
  location,
  gridDataElementKey,
  isEmptyGridDataElement,
}) {
  const {
    gridDataElementActionEdit,
    gridDataElementActionClear,
    gridDataElementActionDelete,
  } = useContext(GridDataElementActionsContext);

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({
    variant: "popover",
    popupId: "actionsMenu",
  });

  const handleOnClickMenu = (e) => {
    popupState.open(e);
  };

  return (
    <StyledActionsDiv>
      {
        <>
          <Radio
            checked={isSelected}
            onClick={() => gridDataElementActionEdit(gridDataElementKey)}
            sx={{ ...buttonPaddingSx }}
            inputProps={{
              "aria-label": `toggle selection for ${location}`,
            }}
          />
        </>
      }
      {
        <StyledMenuIconButton
          onClick={(e) => handleOnClickMenu(e, gridDataElementKey)}
          size="large"
          sx={{
            ...buttonPaddingSx,
          }}
        >
          {popupState.isOpen ? (
            <StyledMenuOpenIcon fontSize="small" />
          ) : (
            <StyledMenuIcon fontSize="small" />
          )}
        </StyledMenuIconButton>
      }
      <ActionsPopover
        popupState={popupState}
        key={gridDataElementKey}
        withEmptyGridDataElement={isEmptyGridDataElement}
        onSelectDelete={() => gridDataElementActionDelete(gridDataElementKey)}
        onSelectClear={() => gridDataElementActionClear(gridDataElementKey)}
      />
    </StyledActionsDiv>
  );
});

/* Helper functions to calculate the number of characters in the
longest string so that the column and font can be resized appropriately */

function getLocationCharSize(data) {
  return (() => {
    let min = 3;
    let max = 6;
    data?.forEach((i) => {
      min = Math.max(min, i.location?.length || 0);
    });
    return Math.min(min, max);
  })();
}

function getTeamCharSize(data) {
  return (() => {
    let min = 4;
    let max = 6;
    data?.forEach((i) => {
      min = Math.max(min, i.team?.length || 0);
    });
    return Math.min(min, max);
  })();
}

export default TableGridDataElements;
