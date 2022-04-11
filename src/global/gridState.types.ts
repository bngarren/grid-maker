export type TemplateElementId = string;
export type TemplateRowId = string;
export type GridDataObjectId = string;
export type ElementBorders = boolean[];
export type TemplateElementType =
  | "text_single"
  | "text_multiline"
  | "placeholder";

export interface TemplateElementStyles {
  widthPercent: number;
  color: string;
  borders: ElementBorders;
}

export interface TemplateElement {
  id: TemplateElementId;
  name: string;
  type: TemplateElementType;
  styles: TemplateElementStyles;
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
