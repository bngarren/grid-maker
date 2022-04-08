import * as React from "react";

import { GridDataObjectId } from "../../../global/gridState.types";

export type GridDataObjectActions = {
  gdoActionsEdit: (gdoId: GridDataObjectId) => () => Promise<void>;
  gdoActionsClear: (gdoId: GridDataObjectId) => () => Promise<void>;
  gdoActionsDelete: (gdoId: GridDataObjectId) => () => Promise<void>;
};

/* This holds the functions we pass way down to the TableGridDataObjects' buttons */
const GridDataObjectActionsContext = React.createContext<GridDataObjectActions>(
  {
    gdoActionsEdit: () => async () => {
      return;
    },
    gdoActionsClear: () => async () => {
      return;
    },
    gdoActionsDelete: () => async () => {
      return;
    },
  }
);
export default GridDataObjectActionsContext;
