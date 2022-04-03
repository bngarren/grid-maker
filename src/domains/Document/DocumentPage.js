import { PDFViewer } from "@react-pdf/renderer";

import MyDocument from "./MyDocument";

import { useSettings } from "../../global/Settings";
import useGridState from "../../global/useGridState";

const DocumentPage = () => {
  const { settings } = useSettings();
  const { gridTemplate, gridData } = useGridState();

  if (gridData) {
    return (
      <div>
        <PDFViewer style={{ width: "100%", height: "900px" }}>
          <MyDocument
            title={settings.document_title}
            colsPerPage={settings.document_cols_per_page}
            template={gridTemplate}
            data={gridData}
          />
        </PDFViewer>
      </div>
    );
  } else {
    return <>Loading</>;
  }
};

export default DocumentPage;
