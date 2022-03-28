// MUI
import { Box } from "@mui/material";

// Custom component
import ContingencyOptionsEditor from "./ContingencyOptionsEditor";

// Context
import { useSettings } from "../../global/Settings";

const ContingenciesSection = ({ onSave = (f) => f }) => {
  /* Get Settings context */
  const { settings } = useSettings();

  const contingencyOptions = settings.contingencyOptions || [];

  /* New contingency option added */
  const handleNewContingencyOption = (val) => {
    onSave("contingencyOptions", [...contingencyOptions, val]);
  };

  /* Removed a contingency option  */
  const handleRemoveContingenyOption = (i) => {
    let newArray = [...contingencyOptions];
    newArray.splice(i, 1);
    onSave("contingencyOptions", newArray);
  };

  return (
    <Box>
      <ContingencyOptionsEditor
        data={contingencyOptions}
        onSubmit={handleNewContingencyOption}
        onRemove={handleRemoveContingenyOption}
      />
    </Box>
  );
};

export default ContingenciesSection;
