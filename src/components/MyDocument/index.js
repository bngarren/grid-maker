import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import RobotoRegular from "../../fonts/roboto/roboto-v27-latin-regular.woff";
import Roboto700 from "../../fonts/roboto/roboto-v27-latin-700.woff";

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

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    marginTop: "5pt",
    paddingHorizontal: "2pt",
  },
  header: {
    fontSize: "13pt",
    textAlign: "center",
  },
  gridListRoot: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    marginTop: "5pt",
  },
  gridListRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  gridBoxRoot: {
    fontSize: "9pt",
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
  removeLeftBorder: {
    borderLeft: "0",
  },
  gridBoxHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "1pt solid black",
  },
  gridBoxHeaderBed: {
    marginRight: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderRight: "1pt solid black",
    fontWeight: "bold",
  },
  gridBoxHeaderName: {
    flexGrow: "4",
  },
  gridBoxHeaderTeam: {
    marginLeft: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderLeft: "1pt solid black",
    minWidth: "11pt",
  },
  gridBoxBodyOneLiner: {
    marginBottom: "1.5pt",
  },
  gridBoxBodyContingencies: {
    display: "flex",
    flexDirection: "row",
    fontSize: "6pt",
    fontWeight: "bold",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "center",
    marginBottom: "1.5pt",
  },
  gridBoxBodyContingencyItem: {
    border: "1pt solid #dbdbdb",
    borderRadius: "2pt",
    paddingLeft: "2pt",
    paddingTop: "1pt",
    marginTop: "0.5pt",
    marginRight: "2pt",
  },
  gridBoxBody: {
    fontSize: "7pt",
    padding: "1pt",
  },
});

const MyDocument = ({ beds, title, colsPerPage, data }) => {
  const getMatrix = (r, c) => {
    let matrix = [];
    let box = 1;
    for (let i = 0; i < r; i++) {
      matrix[i] = [];
      for (let j = 0; j < c; j++) {
        matrix[i][j] = box;
        box++;
      }
    }
    return matrix;
  };

  const matrix = getMatrix(Math.ceil(beds / colsPerPage), colsPerPage);
  console.log(matrix);

  return (
    <Document>
      <Page size="letter" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text>{title}</Text>
        </View>
        <View style={pdfStyles.gridListRoot}>
          {matrix.map((row, rIndex) => {
            return (
              <View style={pdfStyles.gridListRow} wrap={false}>
                {row.map((box, cIndex) => {
                  const objIndex = data.findIndex((obj) => obj.bed === box);
                  return (
                    <GridBox
                      bedspaceData={objIndex >= 0 ? data[objIndex] : null}
                      box={box}
                      removeLeftBorder={cIndex !== 0}
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

const GridBox = ({ bedspaceData, box, removeLeftBorder }) => {
  if (bedspaceData) {
    return (
      <View
        style={[
          pdfStyles.gridBoxRoot,
          removeLeftBorder && pdfStyles.removeLeftBorder,
        ]}
      >
        <View style={pdfStyles.gridBoxHeader}>
          <View style={pdfStyles.gridBoxHeaderBed}>
            <Text>{bedspaceData.bed}</Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderName}>
            <Text>
              {bedspaceData.lastName}
              {bedspaceData.lastName && bedspaceData.firstName && ", "}
              {bedspaceData.firstName}
            </Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderTeam}>
            <Text>{bedspaceData.teamNumber}</Text>
          </View>
        </View>
        <View style={pdfStyles.gridBoxBody}>
          <Text style={pdfStyles.gridBoxBodyOneLiner}>
            {bedspaceData.oneLiner}
          </Text>
          <View style={pdfStyles.gridBoxBodyContingencies}>
            {bedspaceData.contingencies &&
              bedspaceData.contingencies.map((item) => {
                return (
                  <Text style={pdfStyles.gridBoxBodyContingencyItem}>
                    {item}
                  </Text>
                );
              })}
          </View>
          <Text>{bedspaceData.body}</Text>
        </View>
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
