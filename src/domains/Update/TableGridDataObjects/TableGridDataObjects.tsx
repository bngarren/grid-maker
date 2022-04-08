import * as React from "react";

// MUI
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";

// Components
import TableBody from "./TableBody";

// Context/Redux
import { useAppSelector } from "../../../hooks";
import useGridState from "../../../global/useGridState";

// Styling
import {
  StyledTableCellHeader,
  StyledTablePagination,
} from "./StyledTableComponents";

// Defaults //TODO Need to put this in Settings
const ROWS_PER_PAGE = 15;

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
  that gridDataObject. E.g. when using the navigation arrows and you move to a gridDataObject that is on a different paginated page */
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
      <Table aria-label="table of items">
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
        <TableBody
          gridData={gridData}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedKey={selectedKey}
        />
        <TableFooter>
          <TableRow>
            <StyledTablePagination
              rowsPerPageOptions={[5, 15, 30]}
              count={gridData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TableGridDataObjects;
