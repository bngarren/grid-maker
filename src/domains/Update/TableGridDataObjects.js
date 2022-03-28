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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

// Context/Redux
import { useSelector } from "react-redux";
import useGridState from "../../global/useGridState";
import GridDataObjectActionsContext from "./GridDataObjectActionsContext";

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

const TableGridDataObjects = ({ selectedGDO }) => {
  const { gridData } = useGridState();
  const selectedKey = useSelector((state) =>
    state.gridState.gridData.find((gdo) => gdo.id === selectedGDO)
  );
  const indexElement = useSelector(
    (state) =>
      state.gridState.template.elements.byId[
        state.gridState.template.indexElement
      ]
  );

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
  that gridDataObject. E.g. when using the navigation arrows and you move to a gridDataObject that is on
  a different paginated page */
  useEffect(() => {
    // Page should be set so that selectedKey is within range of [page*rowsPerPage, rowsPerPage + rowsPerPage - 1]
    const rowsTotal = gridData.length;
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
  }, [selectedKey, gridData.length, rowsPerPage]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table of items" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          {gridData?.length !== 0 ? (
            <TableRow data-testid="header row with info">
              <StyledTableCellHeader>{indexElement.name}</StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
              <StyledTableCellHeader sx={{ width: "80px" }} />
            </TableRow>
          ) : (
            <TableRow data-testid="header row without info">
              <StyledTableCellHeader colSpan={3} />
            </TableRow>
          )}
        </TableHead>
        <MyTableBody
          data={gridData}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
        />
      </Table>
      <StyledTablePagination
        rowsPerPageOptions={[5, 15, 30]}
        component="div"
        count={gridData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        variant="footer"
      />
    </TableContainer>
  );
};

const MyTableBody = ({ data, page, rowsPerPage, selectedKey }) => {
  const MyInputTableRow = (
    <TableRow>
      <StyledTableCell component="th" scope="row" align="right" colSpan={3}>
        {/* <AddNewGridDataElementForm /> */}
      </StyledTableCell>
    </TableRow>
  );

  return (
    <>
      <TableBody>
        {data?.length !== 0 ? (
          data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((gdo, key) => {
              let adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
              const isSelected = adjustedKey === selectedKey;

              return (
                <MyTableRow
                  adjustedKey={adjustedKey}
                  isSelected={isSelected}
                  key={`MyTableRow-${gdo.id}`}
                  gdo={gdo}
                />
              );
            })
        ) : (
          <TableRow>
            <TableCell scope="row" colSpan={3}>
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

const MyTableRow = memo(function MyTableRow({ adjustedKey, isSelected, gdo }) {
  return (
    <TableRow key={gdo.id} hover selected={isSelected}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        isSelected={isSelected}
      >
        {gdo.indexElementValue || "#"}
      </StyledTableCell>
      <StyledTableCell>{gdo.elements[1].value}</StyledTableCell>
      <StyledTableCell>
        <GridDataObjectActions
          isSelected={isSelected}
          gridDataObjectId={gdo.id}
        />
      </StyledTableCell>
    </TableRow>
  );
});

const GridDataObjectActions = memo(function GridDataObjectActions({
  isSelected,
  gridDataObjectId,
}) {
  const { gdoActionsEdit, gdoActionsDelete, gdoActionsClear } = useContext(
    GridDataObjectActionsContext
  );

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
            onClick={gdoActionsEdit(gridDataObjectId)}
            sx={{ ...buttonPaddingSx }}
          />
        </>
      }
      {
        <StyledMenuIconButton
          onClick={(e) => handleOnClickMenu(e, gridDataObjectId)}
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
        gdoId={gridDataObjectId}
        onSelectDelete={gdoActionsDelete(gridDataObjectId)}
        onSelectClear={gdoActionsClear(gridDataObjectId)}
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

export default TableGridDataObjects;