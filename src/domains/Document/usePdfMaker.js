import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// The pdf document
import MyDocument from "./MyDocument";

//context
import useGridState from "../../global/useGridState";
import { useSettings } from "../../global/Settings";

const usePdfMaker = () => {
  const { settings } = useSettings();
  const { gridData } = useGridState();

  const getMyDocument = () => {
    return (
      <MyDocument
        title={settings.document_title}
        colsPerPage={settings.document_cols_per_page}
        data={gridData}
      />
    );
  };

  const getPdf = async () => {
    await pdf(getMyDocument())
      .toBlob()
      .then((blob) => {
        saveAs(blob, "grid.pdf");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getPdf };
};

export default usePdfMaker;
