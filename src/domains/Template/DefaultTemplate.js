import { v4 as uuidv4 } from "uuid";
const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const TemplateElementType = Object.freeze({
  text_single: "text_single",
  text_multiline: "text_multiline",
  placeholder: "placeholder",
});

const generateDefaultTemplateRowElement = () => {
  return {
    id: uuidv4(),
    name: "Untitled",
    color: getColor(),
    type: TemplateElementType.text_single, // placeholder, text_multiline
    widthPercent: 100,
  };
};

const generateDefaultTemplateRow = () => {
  return {
    id: uuidv4(),
    elements: [],
    fillHeight: false,
  };
};

const generateInitialTemplateData = () => {
  return {
    templateID: uuidv4(),
    rows: {
      byId: {},
      allIds: [],
    },
    elements: {
      byId: {},
      allIds: [],
    },
    indexElement: null,
  };
};

const DefaultTemplate = Object.freeze({
  template: generateInitialTemplateData,
  row: generateDefaultTemplateRow,
  element: generateDefaultTemplateRowElement,
  templateElementType: TemplateElementType,
});

export default DefaultTemplate;
