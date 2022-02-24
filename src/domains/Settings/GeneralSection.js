// MUI
import { Box } from "@mui/material";

// Custom components
import CustomTextField from "./CustomTextField";
import CustomFormControlSetting from "./CustomFormControlSetting";

// Context
import { useGridStateContext } from "../../context/GridState";

// Util
import { getPrettyLocationLayout } from "../../utils";

const GeneralSection = ({ onSave = (f) => f }) => {
  /* Get GridData and locationLayout from context */
  const { locationLayout } = useGridStateContext();

  return (
    <Box>
      <CustomFormControlSetting
        label="Layout"
        id="locationLayout"
        initialValue={getPrettyLocationLayout(locationLayout)}
        onSave={onSave}
      >
        <CustomTextField id="locationLayoutTextField" fullWidth multiline />
      </CustomFormControlSetting>
    </Box>
  );
};

export default GeneralSection;
