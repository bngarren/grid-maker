/** Find out if a specific "location" is already in use
 * in our gridData.
 *
 * @param {Object} incomingGridDataElementData The "new" gridDataElement data
 * @param {array} gridData The array of current gridData
 * @returns {{objIndex: number, locationAlreadyExists: bool}} Object containing the objIndex (0 or greater if
 * this location already exists, -1 if the location does not exist)
 */
export const doesLocationExistInGridData = (
  incomingGridDataElementData,
  gridData
) => {
  const objIndex = gridData.findIndex((obj) => {
    const location = obj.location + ""; // cast location to string before comparison
    return location === incomingGridDataElementData.location + "";
  });
  return { objIndex, locationAlreadyExists: objIndex >= 0 }; // will return -1 if not found
};

/** Helper function for finding next or previous index in given array, or 
cycles to the end.
 * @param {array} arr Array of grid data, e.g. each index is a gridDataObject
 * @param {number} currentIndex Starting index, i.e. current gridDataObject in the editor
 * @param {boolean} reverse  If true, will go back a GDO. If false, will go forward
 * @returns {number} The new index
 */
export const getAdjacentGridDataObject = (
  arr,
  currentIndex,
  reverse = false
) => {
  const newIndex = reverse ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0) {
    return arr.length - 1;
  }
  if (newIndex > arr.length - 1) {
    return 0;
  }
  return newIndex;
};
