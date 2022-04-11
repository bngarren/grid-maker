import * as React from "react";

import DefaultTemplate from "./GenerateDefaultTemplate";

// Redux
import { useAppDispatch } from "../../hooks";
import {
  updateTemplateRowElements,
  updateIndexElement,
} from "./templateEditorSlice";

import {
  TemplateElement,
  TemplateElementId,
  TemplateRowId,
} from "../../global/gridState.types";
import { TemplateRowConstraints } from "./TemplatePage";

function roundToTwo(x: number) {
  return Math.round(x * 100) / 100;
}

/* This hook manages a local "working" state of template elements for a row.  */
const useElements = (
  templateRowId: TemplateRowId,
  initialValue: TemplateElement[],
  constraints: TemplateRowConstraints
) => {
  const prevState = React.useRef(initialValue);
  const [elements, setElements] = React.useState(initialValue);
  const dispatch = useAppDispatch();

  // Actual DOM elements - so we can get dynamic size info from the div's
  const refs = React.useRef<HTMLDivElement[]>([]);

  /* Reset this component's state when new/different initialValue comes through */
  React.useEffect(() => {
    if (JSON.stringify(prevState?.current) !== JSON.stringify(initialValue)) {
      setElements(initialValue);
    }
    prevState.current = initialValue;
  }, [initialValue]);

  /* Send update to redux state templateEditorSlice when our local elements state has changed */
  React.useEffect(() => {
    /* If our local elements state is actually different than the state within redux
    (which we store in the prevState ref), then we will send a new update to redux store */

    //console.log("prevElements", prevState.current);
    //console.log("currentElements", elements);
    if (JSON.stringify(prevState?.current) !== JSON.stringify(elements)) {
      dispatch(
        updateTemplateRowElements({
          rowId: templateRowId,
          rowElements: elements,
        })
      );
    }
  }, [elements, dispatch, templateRowId]);

  const addElement = React.useCallback(() => {
    if (elements.length >= constraints.maxElements) {
      return;
    }
    const newWidthPercent = roundToTwo(100 / (elements.length + 1));
    const newElementsArray: typeof elements = elements.map((el) => {
      return {
        ...el,
        styles: {
          ...el.styles,
          widthPercent: newWidthPercent,
        },
      };
    });
    const defaultElement = DefaultTemplate.element();
    newElementsArray.push({
      ...defaultElement,
      styles: {
        ...defaultElement.styles,
        widthPercent: newWidthPercent,
      },
    });
    setElements(newElementsArray);
  }, [elements, setElements, constraints.maxElements]);

  const removeElement = React.useCallback(
    (elementID) => {
      let newWidthPercent = 100;
      if (elements.length > 2) {
        newWidthPercent = roundToTwo(100 / (elements.length - 1));
      }
      const newElementsArray: typeof elements = elements
        .filter((f) => f.id !== elementID)
        .map((el) => {
          return {
            ...el,
            styles: {
              ...el.styles,
              widthPercent: newWidthPercent,
            },
          };
        });
      setElements(newElementsArray);
    },
    [elements, setElements]
  );

  const handleResizeRight = React.useCallback(
    (e: React.MouseEvent, elementID: TemplateElementId) => {
      e.preventDefault();

      const elementIndex = elements.findIndex((f) => f.id === elementID);
      if (elementIndex === -1) return;

      const width_delta = e.shiftKey
        ? constraints.widthDelta * 2
        : constraints.widthDelta;

      const newElementsArray = [...elements];
      if (elements.length > 1) {
        const nextElement = newElementsArray[elementIndex + 1];

        if (!nextElement) return; // can't resize this direction

        if (
          nextElement.styles.widthPercent - width_delta >=
          constraints.minElementWidth
        ) {
          newElementsArray[elementIndex].styles.widthPercent += width_delta;
          nextElement.styles.widthPercent -= width_delta;
        } else {
          // not enough room for a full width_delta
          const remaining_width_delta =
            nextElement.styles.widthPercent - constraints.minElementWidth;

          newElementsArray[elementIndex].styles.widthPercent +=
            remaining_width_delta;
          nextElement.styles.widthPercent = constraints.minElementWidth;
        }
      }
      setElements(newElementsArray);
    },
    [constraints.minElementWidth, constraints.widthDelta, elements, setElements]
  );

  const handleResizeLeft = React.useCallback(
    (e: React.MouseEvent, elementID: TemplateElementId) => {
      e.preventDefault();

      const elementIndex = elements.findIndex((f) => f.id === elementID);
      if (elementIndex === -1) return;

      const width_delta = e.shiftKey
        ? constraints.widthDelta * 2
        : constraints.widthDelta;

      const newElementsArray = [...elements];
      if (elements.length > 1) {
        const prevElement = newElementsArray[elementIndex - 1];

        if (!prevElement) return; // can't resize this direction

        if (
          prevElement.styles.widthPercent - width_delta >=
          constraints.minElementWidth
        ) {
          newElementsArray[elementIndex].styles.widthPercent += width_delta;
          prevElement.styles.widthPercent -= width_delta;
        } else {
          // not enough room for a full width_delta
          const remaining_width_delta =
            prevElement.styles.widthPercent - constraints.minElementWidth;

          newElementsArray[elementIndex].styles.widthPercent +=
            remaining_width_delta;
          prevElement.styles.widthPercent = constraints.minElementWidth;
        }
      }

      setElements(newElementsArray);
    },
    [constraints.minElementWidth, constraints.widthDelta, elements, setElements]
  );

  const updateElement = React.useCallback(
    (elementID, newElementData) => {
      const updatedElements = elements.map((el) => {
        return el.id === elementID ? { ...el, ...newElementData } : el;
      });
      setElements(updatedElements);
    },
    [elements]
  );

  const setIndexElement = React.useCallback(
    (elementID) => {
      dispatch(updateIndexElement(elementID));
    },
    [dispatch]
  );

  return {
    localElements: elements,
    refs,
    addLocalElement: addElement,
    removeLocalElement: removeElement,
    resizeRight: handleResizeRight,
    resizeLeft: handleResizeLeft,
    updateLocalElement: updateElement,
    setIndexElement: setIndexElement,
  };
};
export default useElements;
