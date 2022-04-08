import * as React from "react";
import { render } from "../../../test-utils";

import GridDataElementActionsContext from "./GridDataObjectActionsContext";
import TableGridDataElements from "./TableGridDataObjects";
import { TEST_GRID_DATA } from "../../../utils";

const MockTableGridDataElements = ({ data, selectedKey }) => {
  const gridDataElementActions = {
    gridDataElementActionEdit: jest.fn(),
    gridDataElementActionClear: jest.fn(),
    gridDataElementActionDelete: jest.fn(),
  };

  return (
    <GridDataElementActionsContext.Provider value={gridDataElementActions}>
      <TableGridDataElements data={data} selectedKey={selectedKey} />
    </GridDataElementActionsContext.Provider>
  );
};

describe("TableGridDataElements", () => {
  it("renders the table", () => {
    const { getByRole } = render(
      <MockTableGridDataElements
        data={TEST_GRID_DATA}
        selectedKey={undefined}
      />
    );
    const tableElement = getByRole(/table/i, { name: /table of items/i });
    expect(tableElement).toBeInTheDocument();
  });

  it("displays an add first item message if gridData array is empty", () => {
    const { getByRole, rerender } = render(
      <MockTableGridDataElements data={[]} selectedKey={undefined} />
    );
    const cellElement = getByRole("cell", {
      name: /add your first item below, or create a layout/i,
    });
    expect(cellElement).toBeVisible();

    rerender(
      <MockTableGridDataElements
        data={[{ location: "1" }]}
        selectedKey={undefined}
      />
    );

    expect(cellElement).not.toBeVisible();
  });

  it("only displays table header when at least 1 gridDataElement is present", () => {
    const { getByTestId, rerender } = render(
      <MockTableGridDataElements data={[]} selectedKey={undefined} />
    );
    let tableRowElement = getByTestId(/header row without info/i);
    expect(tableRowElement).toBeVisible();
    rerender(
      <MockTableGridDataElements
        data={[
          { id: "12345", location: "1", lastName: "Doe", firstName: "John" },
        ]}
        selectedKey={undefined}
      />
    );
    tableRowElement = getByTestId(/header row with info/i);
    expect(tableRowElement).toBeVisible();
  });

  it("renders a table row with correct person name for a gridDataElement", () => {
    const { getByText } = render(
      <MockTableGridDataElements
        data={[
          { id: "12345", location: "1", lastName: "Doe", firstName: "John" },
        ]}
        selectedKey={undefined}
      />
    );
    const rowElement = getByText(/doe, john/i);
    expect(rowElement).toBeVisible();
  });
});
