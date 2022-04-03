import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Rect,
} from "@react-pdf/renderer";

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
  censusRoot: {
    fontSize: "8pt",
    alignSelf: "center",
    flexBasis: "20%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: "5pt",
  },
  gridListRoot: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    marginTop: "2pt",
  },
  gridListRow: {
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
  removeLeftBorder: {
    borderLeft: "0",
  },
  gridBoxHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "1pt solid black",
  },
  gridBoxHeaderLocation: {
    marginRight: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderRight: "1pt solid black",
    fontSize: "8.5pt",
    fontWeight: "bold",
  },
  gridBoxHeaderName: {
    flexGrow: "4",
    alignSelf: "center",
  },
  gridBoxHeaderTeam: {
    marginLeft: "2pt",
    paddingLeft: "3pt",
    paddingRight: "3pt",
    borderLeft: "1pt solid black",
    minWidth: "11pt",
    alignSelf: "center",
    fontSize: "8.5pt",
  },
  gridBoxBodySummary: {
    fontSize: "7pt",
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
    border: "1pt solid #9a9a9a",
    borderRadius: "2pt",
    padding: "1.5pt 0.5pt 0pt 2pt",
    marginTop: "0.5pt",
    marginRight: "2pt",
  },
  gridBoxBody: {
    fontSize: "6pt",
    padding: "2pt 5pt 5pt 2pt",
  },
  gridBoxNestedContentSectionRoot: {
    marginTop: "1.5pt",
    fontSize: "6.5pt",
  },
  gridBoxNestedContentTopText: {
    minHeight: "5pt",
  },
  gridBoxNestedContentTitle: {
    fontWeight: "bold",
  },
  gridBoxNestedContentItemRoot: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "5pt",
  },
  gridBoxNestedContentItemText: {
    marginLeft: "3pt",
  },
  gridBoxBottomText: {
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    fontSize: "7pt",
    padding: "2pt 4pt 2pt 2pt",
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

const MyDocument = ({ locationLayout, title, colsPerPage, data, census }) => {
  const locations = locationLayout.length;

  const getMatrix = (r, c) => {
    let matrix = [];
    let counter = 0;
    for (let i = 0; i < r; i++) {
      // for each row
      matrix[i] = [];
      for (let j = 0; j < c; j++) {
        // for each column
        matrix[i][j] = locationLayout[counter];
        counter++;
      }
    }
    return matrix;
  };

  const matrix = getMatrix(Math.ceil(locations / colsPerPage), colsPerPage);

  return (
    <Document>
      <Page size="letter" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.titleRoot}>
            <Text>{title || " "}</Text>
          </View>

          <View style={pdfStyles.censusRoot}>
            {census ? (
              <>
                <Text>{`${census.filledTotal}/${census.total}`} </Text>
                {census.teamTotals.map((t) => {
                  return (
                    <Text key={t.id}>
                      <Text style={pdfStyles.bold}>{t.id}</Text>
                      {`: ${t.value}`}
                    </Text>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={pdfStyles.gridListRoot}>
          {matrix.map((row, rIndex) => {
            return (
              <View
                style={pdfStyles.gridListRow}
                wrap={false}
                key={`row-${rIndex}`}
              >
                {row.map((box, cIndex) => {
                  const objIndex = data.findIndex(
                    (obj) => obj.location === box
                  );
                  return (
                    <GridBox
                      gridDateElementData={
                        objIndex >= 0 ? data[objIndex] : null
                      }
                      width={getWidth(colsPerPage)}
                      removeLeftBorder={cIndex !== 0}
                      key={`grid-${cIndex}-${box}`}
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

const GridBox = ({ gridDateElementData, width, removeLeftBorder }) => {
  if (gridDateElementData) {
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
        <View style={pdfStyles.gridBoxHeader}>
          <View style={pdfStyles.gridBoxHeaderLocation}>
            <Text>{gridDateElementData.location || " "}</Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderName}>
            <Text>
              {gridDateElementData.lastName || " "}
              {gridDateElementData.lastName &&
                gridDateElementData.firstName &&
                ", "}
              {gridDateElementData.firstName || " "}
            </Text>
          </View>
          <View style={pdfStyles.gridBoxHeaderTeam}>
            <Text>{gridDateElementData.team || " "}</Text>
          </View>
        </View>
        <View style={pdfStyles.gridBoxBody}>
          <Text style={pdfStyles.gridBoxBodySummary}>
            {gridDateElementData.summary || " "}
          </Text>
          <View style={pdfStyles.gridBoxBodyContingencies}>
            {gridDateElementData.contingencies &&
              gridDateElementData.contingencies.map((item, index) => {
                if (item != null)
                  return (
                    <Text
                      style={pdfStyles.gridBoxBodyContingencyItem}
                      key={`${index}-${item}`}
                    >
                      {item || " "}
                    </Text>
                  );
                else return null;
              })}
          </View>
          {gridDateElementData.contentType === "simple" && (
            <Text>{gridDateElementData.simpleContent || " "}</Text>
          )}

          {gridDateElementData.contentType === "nested" && (
            <View>
              {gridDateElementData.nestedContent?.map((sectionData) => {
                return (
                  <View
                    key={sectionData.id}
                    style={pdfStyles.gridBoxNestedContentSectionRoot}
                  >
                    <Text style={pdfStyles.gridBoxNestedContentTopText}>
                      <Text style={pdfStyles.gridBoxNestedContentTitle}>
                        {sectionData.title ? `${sectionData.title}: ` : " "}
                      </Text>
                      {sectionData.top || " "}
                    </Text>
                    {sectionData?.items?.map((item) => {
                      return (
                        <View
                          key={item.id}
                          style={pdfStyles.gridBoxNestedContentItemRoot}
                        >
                          <Svg width="4pt" height="5.5pt">
                            <Rect
                              x="0"
                              y="2pt"
                              width="3pt"
                              height="3pt"
                              stroke="black"
                              fill="black"
                            />
                          </Svg>
                          <Text style={pdfStyles.gridBoxNestedContentItemText}>
                            {item.value || " "}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <View style={pdfStyles.gridBoxBottomText}>
          <Text>{gridDateElementData.bottomText || " "}</Text>
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
