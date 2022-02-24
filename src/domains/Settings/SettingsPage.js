//MUI
import { Container, Stack, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

// custom components
import SettingsPageSection from "./SettingsPageSection";
import GeneralSection from "./GeneralSection";
import DocumentSection from "./DocumentSection";
import ExportSection from "./ExportSection";
import ImportSection from "./ImportSection";
import ContingenciesSection from "./ContingenciesSection";
import SecuritySection from "./SecuritySection";
import { useDialog } from "../../components";

// Context
import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

// Utility
import {
  isGridDataElementEmpty,
  getGridDataElementByLocation,
} from "../../utils";

/* Styling */
const StyledBodyStack = styled(Stack, {
  name: "SettingsPage",
  slot: "body",
})(() => ({}));

const SettingsPage = () => {
  /* Get Settings context */
  const { dispatchSettings } = useSettings();

  /* Get GridData and locationLayout from context */
  const { locationLayout, gridData, updateGridData } = useGridStateContext();

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /**
  * Handles the saving of the Settings data by passing
  new data to SettingsContext via dispatchSettings, or 
  updating locationLayout variable of GridStateContext
  * @param {string} id of the property we are trying to save, e.g. 'locationLayout', 'firstName', etc.
  * @param {Object} value of the property
  * @returns {bool} Returns true if save action was successful, false if not
  */
  const handleOnSave = (id, value) => {
    if (id == null || value == null) {
      throw new Error(
        "Couldn't complete handleOnSave. Either the id or value is null/undefined"
      );
    }

    let success = false;

    if (id === "locationLayout") {
      success = handleSaveLocationLayout(value);
    } else {
      try {
        dispatchSettings({
          type: "UPDATE",
          payload: {
            [id]: value,
          },
        });
        success = true;
      } catch (error) {
        console.error(`Could not save [${id}].`);
      }
    }
    return success;
  };

  /**
   * Handles the saving of the locationLayout in GridStateContext.
   * Importantly, this function checks new vs old locationLayout to alert user
   * if patient data might be overwritten.
   * @param {string} newLocationLayout The "new" locationLayout string from user input
   * @return {bool} Returns true if save was successful, false if not
   */
  const handleSaveLocationLayout = (newLocationLayout) => {
    /* Convert the input locationLayout string (CSV format) to an array */
    const formattedLocationLayout =
      getLocationLayoutArrayFromCsv(newLocationLayout);

    /* Find the locations that differ between the current and new locationLayouts */
    let difference = locationLayout.filter(
      (x) => !formattedLocationLayout.includes(x)
    );
    /* Of these locations, if any, find which ones have gridDataElement data at risk of being deleted */
    let risklocations = [];
    if (difference.length > 0) {
      difference.forEach((i) => {
        // Uses Utility function to get the location's data and see if it's empty
        if (
          !isGridDataElementEmpty(getGridDataElementByLocation(gridData, i))
        ) {
          risklocations.push(i);
        }
      });
    }
    // If there are location(s) with data that are missing from new locationLayout
    if (risklocations.length > 0) {
      // Construct the message for the Dialog
      const content = (
        <div>
          <p>
            This new layout will <b>NOT</b> include the following locations
            which contain data:
          </p>
          <p>
            {risklocations.map((i) => {
              return `| ${i} |     `;
            })}
          </p>
        </div>
      );
      showYesNoDialog(
        content,
        () => {
          // chose to continue
          updateGridData(gridData, formattedLocationLayout);
          return true;
        },
        () => {
          // chose to cancel
          return false;
        },
        { yes: "Continue", no: "Cancel" }
      );
    } else {
      updateGridData(gridData, formattedLocationLayout);
      return true;
    }
  };

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h4" sx={{ marginBottom: "15px" }}>
          Settings
        </Typography>
      </Box>

      <StyledBodyStack direction="column" spacing={4}>
        {/* - - - - - section GENERAL - - - - - */}
        <SettingsPageSection
          title="General"
          section={<GeneralSection onSave={handleOnSave} />}
        />

        {/* - - - - - section DOCUMENT - - - - - */}
        <SettingsPageSection
          title="Document"
          subtitle="Adjust the appearance of the downloadable PDF."
          section={<DocumentSection onSave={handleOnSave} />}
        />

        {/* - - - - - section EXPORT - - - - - */}
        <SettingsPageSection
          title="Export"
          subtitle="Download the current grid as a .json file."
          section={<ExportSection onSave={handleOnSave} />}
        />

        {/* - - - - - section IMPORT - - - - - */}
        <SettingsPageSection
          title="Import"
          subtitle="Upload a previously saved .json file to populate the grid."
          section={<ImportSection />}
        />

        {/* - - - - - section CONTINGENCIES - - - - - */}
        <SettingsPageSection
          title="Contingencies"
          subtitle="Save your custom contingencies for later use."
          section={<ContingenciesSection onSave={handleOnSave} />}
        />

        {/* - - - - - section SECURITY - - - - - */}
        <SettingsPageSection
          title="Security & Privacy"
          subtitle="Manage your browser data."
          section={<SecuritySection showYesNoDialog={showYesNoDialog} />}
        />
      </StyledBodyStack>
      {dialogIsOpen && dialog}
    </Container>
  );
};

/**
 * Helper function for taking the input locationLayout (CSV format) and
 * converting it to a valid array. This is NOT where
 * validation happens. It does take accepted characters, i.e, commas,
 * and converts them to an appropriate format.
 * @param {string} csv String containing comma-separated values
 * @return {array} Array containing locationLayout, e.g. ["1", "2", "3"]
 */
const getLocationLayoutArrayFromCsv = (csv) => {
  let res = [];
  if (csv == null || csv === "") return res;

  /* This regex looks for zero or more spaces, followed by a comma,
  followed by zero or more spaces—and, when found, removes the spaces
  and the comma from the string */
  const remove = /\s*(?:,|$)\s*/;
  let arr = csv.split(remove);
  arr.forEach((element) => {
    if (element === "") return;
    res.push(element.trim());
  });

  return res;
};

export default SettingsPage;
