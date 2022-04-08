import * as React from "react";
import { TableRow as MuiTableRow } from "@mui/material";
import { GridDataObject } from "../../../global/gridState.types";
import { StyledTableCell } from "./StyledTableComponents";
import TableRowActions from "./TableRowActions";

interface TableRowProps {
  isSelected: boolean;
  gdo: GridDataObject;
}

/**
 * This is a custom TableRow that wraps MUI's TableRow and is used to render each
 * gridDataObject's info with associated actions (e.g. delete, clear, etc.)
 */
const TableRow = ({ isSelected, gdo, ...rest }: TableRowProps) => {
  return (
    <MuiTableRow hover selected={isSelected} {...rest}>
      <StyledTableCell
        component="th"
        scope="row"
        align="center"
        isSelected={isSelected}
      >
        {gdo.indexElementValue || "?"}
      </StyledTableCell>
      {/* "Display value" for GDO */}
      <StyledTableCell>{gdo.elements[1].value}</StyledTableCell>
      <StyledTableCell>
        <TableRowActions isSelected={isSelected} gridDataObjectId={gdo.id} />
      </StyledTableCell>
    </MuiTableRow>
  );
};

TableRow.muiName = "TableRow";
export default React.memo(TableRow);
