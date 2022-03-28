import { PDFViewer } from "@react-pdf/renderer";

import MyDocument from "./MyDocument";

import { useSettings } from "../../global/Settings";
import { useGridState } from "../../global/GridState";

const DocumentPage = () => {
  const { settings } = useSettings();
  const { locationLayout, gridData, census } = useGridState();

  if (gridData) {
    return (
      <div>
        <PDFViewer style={{ width: "100%", height: "900px" }}>
          <MyDocument
            locationLayout={locationLayout}
            title={settings.document_title}
            colsPerPage={settings.document_cols_per_page}
            data={gridData}
            census={census}
          />
        </PDFViewer>
      </div>
    );
  } else {
    return <>Loading</>;
  }
};

export default DocumentPage;
