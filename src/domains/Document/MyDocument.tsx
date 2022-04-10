import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Util
import { ptToPx } from "../../utils";

// Font
import RobotoRegular from "../../assets/fonts/roboto/roboto-v27-latin-regular.woff";
import Roboto700 from "../../assets/fonts/roboto/roboto-v27-latin-700.woff";

//Types
import {
  GridData,
  GridDataObject,
  GridTemplate,
} from "../../global/gridState.types";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: RobotoRegular,
    },
    {
      src: Roboto700,
      fontWeight: "bold",
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

/* Hard coded Pt sizes for Letter size PDF document
depending on number of columns per page (the key) */
export const WIDTH_MAP: { [key: number]: number } = {
  1: 608,
  2: 304,
  3: 202.4,
  4: 152,
  5: 121.7,
};

type DocumentStyle = { [key: string]: string | number };
/**
 * This styling defines the look of the Grid on paper,
 * and thus uses Pt units for print.
 */
const DOCUMENT_STYLE: DocumentStyle = {
  height: 185,
  elementPaddingX: 1,
  lineHeight: 1.2,
  letterSpacing: -0.15,
};

// Styling
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    paddingHorizontal: "2pt",
    paddingTop: "2pt",
  },
  header: {
    fontSize: "13pt",
    display: "flex",
    flexDirection: "row",
  },
  titleRoot: {
    flexGrow: 1,
    textAlign: "center",
  },
  gridRoot: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    marginTop: "2pt",
  },
  gridRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  gridBoxRoot: {
    position: "relative",
    fontSize: "8pt",
    display: "flex",
    flexBasis: "0",
    flex: "1",
    color: "black",
    textAlign: "left",
    backgroundColor: "white",
    border: "1pt solid black",
    height: `${DOCUMENT_STYLE.height}pt`,
    fontFamily: "Roboto",
    marginTop: "-1pt",
  },
  gridBoxRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
  },
  gridBoxRowElement: {
    paddingLeft: DOCUMENT_STYLE.elementPaddingX,
    paddingRight: DOCUMENT_STYLE.elementPaddingX,
    lineHeight: DOCUMENT_STYLE.lineHeight,
    letterSpacing: DOCUMENT_STYLE.letterSpacing,
  },
  removeLeftBorder: {
    borderLeft: "0",
  },
  bold: {
    fontWeight: "bold",
  },
});

/**
 * Calculates the width of a single gridBox in pt units and returns it as a number.
 * Given a number of grid columns per page, internally, it uses a lookup
 * --currently based on Letter size document--to get the maximized amount
 * of width available for a single grid box.
 */
export const getWidthInPt = (colsPerPage: number) => {
  return WIDTH_MAP[colsPerPage];
};

export const getWidthInPx = (colsPerPage: number) => {
  return ptToPx(getWidthInPt(colsPerPage)); // Pt to Px conversion factor
};

/**
 * Gets the style as defined for the pdf Document.
 * Any number which is defined in Pt units in the document
 * is returned here in Px units
 */
export const getDocumentStyle = (key: string) => {
  const value = DOCUMENT_STYLE[key];
  if (typeof value === "number") {
    // These are stored as Pt and need to be sent as Px
    if (["height", "elementPaddingX", "letterSpacing"].includes(key))
      return ptToPx(value);
  }
  return value;
};

interface GridBoxProps {
  template: GridTemplate;
  gridDataObject: GridDataObject;
  width: number;
  removeLeftBorder: boolean;
}

const GridBox = ({
  template,
  gridDataObject,
  width,
  removeLeftBorder,
}: GridBoxProps) => {
  if (gridDataObject) {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          {
            ...(removeLeftBorder && pdfStyles.removeLeftBorder),
            minWidth: `${width}pt`,
            maxWidth: `${width}pt`,
          },
        ]}
      >
        {template?.rows.allIds.map((rowId) => (
          <View key={rowId} style={pdfStyles.gridBoxRow}>
            {template?.rows.byId[rowId].elements.map((rel) => {
              const templateElement = template?.elements.byId[rel];
              const gdoElement = gridDataObject?.elements.find(
                (f) => f.id === rel
              );
              return (
                <View
                  key={rel}
                  style={[
                    pdfStyles.gridBoxRowElement,
                    {
                      width: `${templateElement.widthPercent}%`,
                    },
                  ]}
                >
                  <Text>{gdoElement?.value ?? " "}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  } else {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          { ...(removeLeftBorder && pdfStyles.removeLeftBorder) },
        ]}
      ></View>
    );
  }
};

interface MyDocumentProps {
  title: string;
  colsPerPage: number;
  template: GridTemplate;
  data: GridData;
}

const MyDocument = ({
  title,
  colsPerPage,
  template,
  data,
}: MyDocumentProps) => {
  const totalGDO = data.length;

  type Matrix = MatrixRowItem[];
  type MatrixRowItem = GridDataObject[];
  /* Creates a matrix of gridDataObjects to iterate through in order to generate the grid  */
  const getMatrix = (numRows: number, numCols: number) => {
    const matrix: Matrix = [];
    let counter = 0;
    for (let i = 0; i < numRows; i++) {
      // for each row
      matrix[i] = [];
      for (let j = 0; j < numCols; j++) {
        // for each column
        matrix[i][j] = data[counter];
        counter++;
      }
    }
    return matrix;
  };

  const matrix = getMatrix(Math.ceil(totalGDO / colsPerPage), colsPerPage);

  return (
    <Document>
      <Page size="LETTER" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.titleRoot}>
            <Text>{title || " "}</Text>
          </View>
        </View>
        <View style={pdfStyles.gridRoot}>
          {matrix.map((row, rIndex) => {
            return (
              <View
                style={pdfStyles.gridRow}
                wrap={false}
                key={`row-${rIndex}`}
              >
                {row.map((gdo, cIndex) => {
                  return (
                    <GridBox
                      template={template}
                      gridDataObject={gdo}
                      width={getWidthInPt(colsPerPage)}
                      removeLeftBorder={cIndex !== 0}
                      key={`row-${rIndex}-col-${cIndex}`}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
