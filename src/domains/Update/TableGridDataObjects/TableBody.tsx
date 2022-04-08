import {
  TableRow as MuiTableRow,
  TableCell,
  TableBody as MuiTableBody,
} from "@mui/material";
import { GridData } from "../../../global/gridState.types";
import { APP_TEXT } from "../../../utils";
import AddNewGridDataObjectInput from "./AddNewGridDataObjectInput";
import { StyledTableCell } from "./StyledTableComponents";
import TableRow from "./TableRow";

interface TableBodyProps {
  gridData: GridData;
  page: number;
  rowsPerPage: number;
  selectedKey: number;
}

const TableBody = ({
  gridData,
  page,
  rowsPerPage,
  selectedKey,
}: TableBodyProps) => {
  return (
    <MuiTableBody>
      {gridData?.length !== 0 ? (
        gridData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((gdo, key) => {
            const adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
            const isSelected = adjustedKey === selectedKey;

            return (
              <TableRow
                isSelected={isSelected}
                key={`TableRow-${gdo.id}`}
                gdo={gdo}
              />
            );
          })
      ) : (
        <MuiTableRow>
          <TableCell scope="row" colSpan={3}>
            {APP_TEXT.addFirstGridDataObjectPrompt}
          </TableCell>
        </MuiTableRow>
      )}
      <MuiTableRow>
        <StyledTableCell component="th" scope="row" align="right" colSpan={3}>
          <AddNewGridDataObjectInput />
        </StyledTableCell>
      </MuiTableRow>
    </MuiTableBody>
  );
};

export default TableBody;
