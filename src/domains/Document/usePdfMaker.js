import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// The pdf document
import MyDocument from "./MyDocument";

//context
import { useGridStateContext } from "../../context/GridState";
import { useSettings } from "../../context/Settings";

const usePdfMaker = () => {
  const { settings } = useSettings();
  const { locationLayout, gridData, census } = useGridStateContext();

  const getMyDocument = () => {
    return (
      <MyDocument
        locationLayout={locationLayout}
        title={settings.document_title}
        colsPerPage={settings.document_cols_per_page}
        data={gridData}
        census={census}
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
