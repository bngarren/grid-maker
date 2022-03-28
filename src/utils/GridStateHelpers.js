export const findElementInGridData = (gridData, elementID) => {
  let res = gridData.findIndex((el) => {
    return (el.templateElementID = elementID);
  });
  return res >= 0 ? res : null;
};

/**
 * Loop through each templateElement within gridTemplate. If the elementID already exists
in gridData, update the templateElementName, if necessary. Keep the previous value for now.
If the elementID doesn't exist, add a new object to the gridData array. If gridData contains
elementID's that aren't in the new gridTemplate, these are removed.
 */
export const mergeGridTemplateWithGridData = (gridTemplate, gridData) => {
  let newGridData = [];

  // Loop through each gridTemplate row
  gridTemplate.rows.forEach((row) => {
    // Loop through each templateElement for this row
    row.elements.forEach((element) => {
      let elementInGridData = findElementInGridData(
        gridData,
        element.elementID
      );
      if (elementInGridData) {
        newGridData[elementInGridData] = {
          ...gridData[elementInGridData],
          templateElementName: element.name,
        };
      } else {
        newGridData.push({
          templateElementID: element.elementID,
          templateElementName: element.name,
          value: "",
        });
      }
    });
  });

  return newGridData;
};
