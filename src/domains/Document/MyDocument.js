import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Font
import RobotoRegular from "../../assets/fonts/roboto/roboto-v27-latin-regular.woff";
import Roboto700 from "../../assets/fonts/roboto/roboto-v27-latin-700.woff";

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
    height: "185pt",
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
    padding: "1pt",
  },
  removeLeftBorder: {
    borderLeft: "0",
  },
  bold: {
    fontWeight: "bold",
  },
});

/* Hard coded Pt sizes for Letter size PDF document
depending on number of columns per page (the key) */
export const WIDTH_MAP = {
  1: 608,
  2: 304,
  3: 202.4,
  4: 152,
  5: 121.7,
};

export const getWidth = (colsPerPage, factor = 1) => {
  let res = "";
  if (colsPerPage) {
    res = WIDTH_MAP[colsPerPage] * factor;
  } else {
    res = WIDTH_MAP[4] * factor;
  }
  return res.toString() + "pt";
};

const MyDocument = ({ title, colsPerPage, template, data }) => {
  const totalGDO = data.length;
  const getMatrix = (r, c) => {
    let matrix = [];
    let counter = 0;
    for (let i = 0; i < r; i++) {
      // for each row
      matrix[i] = [];
      for (let j = 0; j < c; j++) {
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
      <Page size="letter" style={pdfStyles.page}>
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
                      width={getWidth(colsPerPage)}
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

const GridBox = ({ template, gridDataObject, width, removeLeftBorder }) => {
  if (gridDataObject) {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          removeLeftBorder && pdfStyles.removeLeftBorder,
          {
            minWidth: width,
            maxWidth: width,
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
                    { width: `${templateElement.widthPercent}%` },
                  ]}
                >
                  <Text>{gdoElement.value ?? "null"}</Text>
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
          removeLeftBorder && pdfStyles.removeLeftBorder,
        ]}
      ></View>
    );
  }
};

export default MyDocument;
