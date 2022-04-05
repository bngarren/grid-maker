export type TemplateElementId = string;
export type TemplateRowId = string;
export type GridDataObjectId = string;

export interface TemplateElement {
  id: TemplateElementId;
  name: string;
  color: string;
  type: "text_single" | "text_multiline";
  widthPercent: number;
}

export interface TemplateRow {
  id: TemplateRowId;
  elements: TemplateElementId[];
  fillHeight: boolean;
}

export interface GridTemplate {
  id: string;
  rows: {
    byId: {
      [key: TemplateRowId]: TemplateRow;
    };
    allIds: TemplateRowId[];
  };
  elements: {
    byId: {
      [key: TemplateElementId]: TemplateElement;
    };
    allIds: TemplateElementId[];
  };
  indexElement: TemplateElementId;
}

export interface GridDataObjectElement {
  id: TemplateElementId;
  name: string;
  value: string;
}

export interface GridDataObject {
  id: GridDataObjectId;
  indexElementValue: string;
  elements: GridDataObjectElement[];
}

export type GridData = GridDataObject[];

export interface GridState {
  template: GridTemplate;
  gridData: GridData;
}

export interface FormElementValues {
  [key: TemplateElementId]: string;
}
