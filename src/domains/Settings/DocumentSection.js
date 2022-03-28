// MUI
import { Box, Stack, Select, MenuItem } from "@mui/material";

// Custom components
import CustomTextField from "./CustomTextField";
import CustomFormControlSetting from "./CustomFormControlSetting";

// Context
import { useSettings } from "../../global/Settings";

const DocumentSection = ({ onSave = (f) => f }) => {
  /* Get Settings context */
  const { settings } = useSettings();

  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <CustomFormControlSetting
          label="Title"
          id="document_title"
          initialValue={settings.document_title}
          onSave={onSave}
        >
          <CustomTextField id="documentTitleTextField" />
        </CustomFormControlSetting>

        <CustomFormControlSetting
          label="Grids per Row"
          id="document_cols_per_page"
          initialValue={settings.document_cols_per_page}
          onSave={onSave}
        >
          <Select id="document_cols_per_page">
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </CustomFormControlSetting>
      </Stack>
    </Box>
  );
};

export default DocumentSection;
