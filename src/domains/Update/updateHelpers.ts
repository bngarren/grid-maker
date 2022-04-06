import { GridData } from "../../global/gridState.types";

/** Helper function for finding next or previous index in given array, or 
cycles to the end.
 * @param {array} arr Array of grid data, e.g. each index is a gridDataObject
 * @param {number} currentIndex Starting index, i.e. current gridDataObject in the editor
 * @param {boolean} reverse  If true, will go back a GDO. If false, will go forward
 * @returns {number} The new index
 */
export const getAdjacentGridDataObject = (
  arr: GridData,
  currentIndex: number,
  reverse = false
) => {
  const newIndex = reverse ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0) {
    return arr[arr.length - 1];
  }
  if (newIndex > arr.length - 1) {
    return arr[0];
  }
  return arr[newIndex];
};
