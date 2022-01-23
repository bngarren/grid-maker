export const sortByBed = (arr) => {
  if (arr == null) {
    throw new Error(`Cannot sortByBed, invalid input array.`);
  }

  if (arr === "") return "";

  // sorts by bed number in ascending order
  return arr.sort((el1, el2) => {
    let bed1 = el1.bed;
    let bed2 = el2.bed;

    bed1 = typeof bed1 === "string" ? bed1 : bed1.toString();
    bed2 = typeof bed2 === "string" ? bed2 : bed2.toString();
    return bed1.localeCompare(bed2, "en", { numeric: true });
  });
};

/* Helpful for determining if delete icon should be shown or not */
export const isBedEmpty = (bedData) => {
  let result = true;
  for (const [key, value] of Object.entries(bedData)) {
    if (key !== "bed" && value) {
      // if any value but bed is non-empty
      result = false;
    }
  }
  return result;
};

export const getDataForBed = (gridData, bed) => {
  let res;
  gridData.forEach((i) => {
    if (i.bed === bed) res = i;
  });
  return res;
};

/* Helper function - Since bedLayout is stored as an array, we use the
    reduce function to prettify it for the text input */
export const getPrettyBedLayout = (bl) => {
  let prettyBedLayout;
  if (bl && bl.length > 0) {
    bl.sort((el1, el2) => {
      el1 = String(el1);
      return el1.localeCompare(el2, "en", { numeric: true });
    });
    prettyBedLayout = bl.reduce((accum, current) => {
      return `${accum}, ${current}`;
    });
  } else {
    prettyBedLayout = bl;
  }
  return prettyBedLayout;
};
