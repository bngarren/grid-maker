import { cloneElement } from "react";
import { saveAs } from "file-saver";

// Context
import { useGridStateContext } from "../../context/GridState";

// Utility
import { getJsonObjectFromArray } from "../../utils/Utility";

/* Saves the .json file */
const exportDataWithFilename = (data, filename) => {
  const blob = new Blob([data], {
    type: "application/json",
  });
  saveAs(blob, `${filename}.json`);
};

/* This component will add an onClick function to its children component that
will export the grid data to json. 
E.g. If Exporter surrounds a Button component it will add onClick function
*/
const Exporter = ({
  children,
  gridDataToExport,
  filename = "grid",
  onExported = (f) => f,
}) => {
  /* Either use the selected grid data passed in as a prop,
  or default to the full gridData from GridStateContext */
  const { gridData } = useGridStateContext();
  const gridDataJson = getJsonObjectFromArray(gridDataToExport || gridData);

  const handleExport = () => {
    try {
      exportDataWithFilename(gridDataJson, filename);
    } catch (err) {
      console.error(`Error in Exporter: ${err}`);
    } finally {
      onExported();
    }
  };

  return cloneElement(children, { onClick: handleExport });
};

export default Exporter;
