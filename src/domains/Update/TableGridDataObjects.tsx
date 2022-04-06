import * as React from "react";

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
  Paper,
  Radio,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { styled } from "@mui/material/styles";

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
import { useAppSelector } from "../../hooks";
import useGridState from "../../global/useGridState";
import GridDataObjectActionsContext from "./GridDataObjectActionsContext";

// Types
import {
  GridData,
  GridDataObject,
  GridDataObjectId,
} from "../../global/gridState.types";

// Defaults //TODO Need to put this in Settings
const ROWS_PER_PAGE = 15;

/* Styling */

interface StyledFlags {
  isSelected?: boolean;
  component?: string;
}

const StyledTableCellHeader = styled(TableCell, {
  name: "TableGridDataObjects",
  slot: "header",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: "4px",
  borderBottom: "none",
  textAlign: "center",
}));

const StyledTableCell = styled(TableCell, {
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

const StyledRadioButton = styled(Radio, {
  name: "TableGridDataObjects",
  slot: "radio",
})(({ theme }) => ({
  "& .MuiSvgIcon-root[data-testid='RadioButtonCheckedIcon']": {
    fill: theme.palette.secondary.dark,
  },
}));

const StyledTablePagination = styled(TablePagination, {
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

const StyledActionsDiv = styled("div", {
  name: "TableGridDataObjects",
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
} as const;

const StyledMenuIconButton = styled(IconButton)(() => ({}));

const menuIconStyle = {
  cursor: "pointer",
  fontSize: "1.5rem",
} as const;

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const StyledMenuOpenIcon = styled(MenuOpenIcon)(({ theme }) => ({
  ...menuIconStyle,
  color: theme.palette.primary.light,
}));

const TableGridDataObjects = () => {
  const { gridData } = useGridState();
  const selectedGDO = useAppSelector((state) => state.gridEditor.selectedGDO);
  const selectedKey = useAppSelector((state) =>
    state.gridState.gridData.findIndex((gdo) => gdo.id === selectedGDO?.id)
  );
  const indexElement = useAppSelector(
    (state) =>
      state.gridState.template.elements.byId[
        state.gridState.template.indexElement
      ]
  );

  // table pagination
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(ROWS_PER_PAGE);

  const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setRowsPerPage(event.target.valueAsNumber);
    setPage(0);
  };

  /* Watches for changes in selectedKey and picks the correct paginated page that contains
  that gridDataObject. E.g. when using the navigation arrows and you move to a gridDataObject that is on
  a different paginated page */
  React.useEffect(() => {
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
          gridData={gridData}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
        />
      </Table>
      <StyledTablePagination
        rowsPerPageOptions={[5, 15, 30]}
        count={gridData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        variant="footer"
      />
    </TableContainer>
  );
};

interface MyTableBodyProps {
  gridData: GridData;
  page: number;
  rowsPerPage: number;
  selectedKey: number;
}

const MyTableBody = ({
  gridData,
  page,
  rowsPerPage,
  selectedKey,
}: MyTableBodyProps) => {
  // Table row used for inputing new data
  const MyInputTableRow = (
    <TableRow>
      <StyledTableCell component="th" scope="row" align="right" colSpan={3}>
        {/* <AddNewGridDataElementForm /> */}
      </StyledTableCell>
    </TableRow>
  );

  return (
    <TableBody>
      {gridData?.length !== 0 ? (
        gridData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((gdo, key) => {
            const adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
            const isSelected = adjustedKey === selectedKey;

            return (
              <MyTableRow
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
  );
};

interface MyTableRowProps {
  isSelected: boolean;
  gdo: GridDataObject;
}

const MyTableRow = React.memo(function MyTableRow({
  isSelected,
  gdo,
}: MyTableRowProps) {
  return (
    <TableRow key={gdo.id} hover selected={isSelected}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        isSelected={isSelected}
      >
        {gdo.indexElementValue ?? "#"}
      </StyledTableCell>
      {/* "Display value" for GDO */}
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

interface GridDataObjectActionsProps {
  isSelected: boolean;
  gridDataObjectId: GridDataObjectId;
}

const GridDataObjectActions = React.memo(function GridDataObjectActions({
  isSelected,
  gridDataObjectId,
}: GridDataObjectActionsProps) {
  const { gdoActionsEdit, gdoActionsDelete, gdoActionsClear } =
    React.useContext(GridDataObjectActionsContext);

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({
    variant: "popover",
    popupId: "actionsMenu",
  });

  const handleOnClickMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    popupState.open(e);
  };

  return (
    <StyledActionsDiv>
      <StyledRadioButton
        checked={isSelected}
        onClick={gdoActionsEdit(gridDataObjectId)}
        sx={{
          ...buttonPaddingSx,
        }}
      />
      <StyledMenuIconButton
        onClick={handleOnClickMenu}
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

      <ActionsPopover
        popupState={popupState}
        onSelectDelete={gdoActionsDelete(gridDataObjectId)} //curried
        onSelectClear={gdoActionsClear(gridDataObjectId)} //curried
      />
    </StyledActionsDiv>
  );
});

export default TableGridDataObjects;
