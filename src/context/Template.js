import * as React from "react";
import { v4 as uuidv4 } from "uuid";
const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const TemplateElementType = Object.freeze({
  text_single: "text_single",
  text_multiline: "text_multiline",
  placeholder: "placeholder",
});

const generateDefaultTemplateRowElement = () => {
  return {
    elementID: uuidv4(),
    name: "Untitled",
    color: getColor(),
    type: TemplateElementType.text_single, // placeholder, text_multiline
    widthPercent: 100,
  };
};

const generateDefaultTemplateRow = () => {
  return {
    rowID: uuidv4(),
    elements: [],
    heightFactor: 1, //-1 is fullHeight, 1 is single row, 2, 3, etc.
  };
};

const generateInitialTemplateData = () => {
  return {
    templateID: uuidv4(),
    rows: [],
    elements: [],
    indexElement: null,
  };
};

export const DefaultTemplateGenerator = Object.freeze({
  template: generateInitialTemplateData,
  row: generateDefaultTemplateRow,
  element: generateDefaultTemplateRowElement,
});

const TemplateContext = React.createContext();
export const TemplateProvider = ({ children }) => {
  const [template, _setTemplate] = React.useState(
    DefaultTemplateGenerator.template()
  );

  const setTemplate = React.useCallback((templateJSON) => {
    _setTemplate(templateJSON);
  }, []);

  /* Load template from local storage */
  React.useEffect(() => {
    const data = localStorage.getItem("gridTemplate");

    setTemplate(JSON.parse(data));
  }, [setTemplate]);

  /* When state changes, save to local storage */
  React.useEffect(() => {
    if (template != null) {
      const dataToSave = JSON.stringify(template);
      localStorage.setItem("gridTemplate", dataToSave);
    }
  }, [template]);

  const value = {
    gridTemplate: template,
    setGridTemplate: setTemplate,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateProvider;

export const useTemplate = () => {
  const context = React.useContext(TemplateContext);
  if (context === undefined) {
    throw new Error(
      "useTemplate must be consumed within a TemplateProvider component."
    );
  }
  return context;
};
