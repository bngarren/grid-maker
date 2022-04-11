import { v4 as uuidv4 } from "uuid";
import {
  GridTemplate,
  TemplateElement,
  TemplateRow,
} from "../../global/gridState.types";
const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const generateDefaultTemplateElement = (): TemplateElement => {
  return {
    id: uuidv4(),
    name: "Untitled",
    type: "text_single",
    styles: {
      color: getColor(),
      widthPercent: 100,
      borders: [],
    },
  };
};

const generateDefaultTemplateRow = (): TemplateRow => {
  return {
    id: uuidv4(),
    elements: [],
    fillHeight: false,
  };
};

const generateInitialTemplateData = (): GridTemplate => {
  return {
    id: uuidv4(),
    rows: {
      byId: {},
      allIds: [],
    },
    elements: {
      byId: {},
      allIds: [],
    },
    indexElement: "",
  };
};

const DefaultTemplate = Object.freeze({
  template: generateInitialTemplateData,
  row: generateDefaultTemplateRow,
  element: generateDefaultTemplateElement,
});

export default DefaultTemplate;
