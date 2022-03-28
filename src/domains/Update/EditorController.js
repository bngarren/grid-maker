import { useState, useEffect, useCallback, useRef } from "react";

// MUI
import {
  Grid,
  Box,
  Stack,
  Toolbar,
  Typography,
  Switch,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import { styled } from "@mui/system";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CircleIcon from "@mui/icons-material/Circle";

// React-hook-form
import { useForm, FormProvider } from "react-hook-form";

// Hotkeys
import useHotkey from "../../hooks/useHotkey";

// Components
import DemoBox from "./DemoBox";
import Editor from "./Editor";
import { ButtonStandard } from "../../components";

// Context
import { useSelector } from "react-redux";
import useGridState from "../../global/useGridState";
import { useSettings } from "../../global/Settings";

// Util
import { APP_TEXT } from "../../utils";

/* Styling */

const StyledGridContainer = styled(Grid, {
  name: "EditorController",
  slot: "container",
  shouldForwardProp: (prop) => prop !== "isDirty" && prop !== "addTopMargin",
})(({ theme, isDirty, addTopMargin }) => ({
  boxShadow: isDirty ? theme.shadows[5] : theme.shadows[1],
  borderRadius: "4px",
  marginTop: addTopMargin && theme.spacing(1),
}));

const StyledToolbarTop = styled(Toolbar, {
  name: "EditorController",
  slot: "toolbar-top",
  shouldForwardProp: (prop) => prop !== "isDirty",
})(({ theme, isDirty }) => ({
  minHeight: "36px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: isDirty
    ? theme.palette.primary.light
    : theme.palette.primary.main,
  borderTopRightRadius: "4px",
  borderTopLeftRadius: "4px",
  transition: theme.transitions.create(["background-color"]),
}));

const StyledToolbarBottom = styled(Toolbar, {
  name: "EditorController",
  slot: "toolbar-bottom",
  shouldForwardProp: (prop) => prop !== "isDirty",
})(({ theme, isDirty }) => ({
  minHeight: "32px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  fontSize: theme.typography.formFontSizeLevel3,
  color: theme.palette.secondary.light,
  backgroundColor: isDirty
    ? theme.palette.primary.light
    : theme.palette.primary.main,
  borderBottomRightRadius: "4px",
  borderBottomLeftRadius: "4px",
  transition: theme.transitions.create(["background-color"]),
}));

const StyledNavigateIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
  padding: 2,
  "&:hover": {
    color: theme.palette.secondary.dark,
    cursor: "pointer",
    backgroundColor: "transparent",
  },
}));

const EditorController = ({
  dirtyFormCallback = (f) => f,
  onChangeGridDataElement = (f) => f,
  onSave = (f) => f,
}) => {
  const { settings, dispatchSettings } = useSettings();

  const selectedGDO = useSelector((state) => state.gridEditor.selectedGDO); // id
  const { getGridDataObjectById } = useGridState();
  const currentGridDataObject = getGridDataObjectById(selectedGDO);

  const currentGridDataObjectIdRef = useRef(currentGridDataObject?.id);

  const form = useForm({
    defaultValues: { ...currentGridDataObject },
  });

  const {
    control,
    reset,
    formState: { isDirty, isSubmitted, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = form;

  /* Reset the form to initial values when new/different
  gridDataElement data comes through */
  useEffect(() => {
    /* Dont reset anything if currently submitting form */
    if (!isSubmitting) {
      /* A new gridDataElement has been selected and passed in */
      if (currentGridDataObjectIdRef.current !== currentGridDataObject.id) {
        reset({ ...currentGridDataObject });
        currentGridDataObjectIdRef.current = currentGridDataObject.id;
      }
    }
  }, [reset, currentGridDataObject, isSubmitting]);

  /* Reset the formstate after a submit is successful */
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...currentGridDataObject }, { keepSubmitCount: true });
    }
  }, [reset, currentGridDataObject, isSubmitted, isSubmitSuccessful]);

  /* Notify UpdatePage of isDirty status */
  useEffect(() => {
    dirtyFormCallback(isDirty);
  }, [isDirty, dirtyFormCallback]);

  /* The save process can be initiated by save button click or hotkey */
  const onSaveInitiation = (e) => {
    handleSubmit(
      onSubmitValid,
      onSubmitError
    )(e).catch((error) => {
      console.warn("Save was aborted.", error);
    }); //curried
  };

  /* Handles when the form passes validation after submit. This function
  will check for an 'id' key or create a new one, then send the data
  back to UpdatePage for saving. */
  const onSubmitValid = useCallback(
    async (data) => {
      console.log("submitted data", data); //! DEBUG

      /* Send to UpdatePage for saving via "onSave" callback. "data" is the Editor's gridDataElement's data */
      let res = await onSave(data);
      if (!res) {
        throw new Error(
          "unsuccessful save (could be error or canceled by the user)"
        );
      }
    },
    [onSave]
  );

  const onSubmitError = useCallback((errors) => {}, []);

  /* 
  This handles the Save button. It prevents the html form submission
  See https://github.com/react-hook-form/react-hook-form/issues/1025#issuecomment-585652414
  */
  const onClickSaveButton = (e) => {
    e.preventDefault();
    onSaveInitiation();
  };

  /* Perform the form submit when the hotkey save action fires */
  const handleHotkeySave = (e) => {
    e.preventDefault();
    /* Only try to submit form if form is dirty */
    if (isDirty) {
      onSaveInitiation(e);
    }
  };

  /* Register the save hotkey. The callback is memoized within, but
  we pass isDirty as a dependency array to avoid stale closure. */
  useHotkey("saveGridData", handleHotkeySave, null, [
    isDirty,
    onSaveInitiation,
  ]);

  /* DemoBox show/hide */
  /* Track the toggle state of DemoBox */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(
    !settings.show_demoBox
  );

  /* Update the user settings when DemoBox toggle changes */
  useEffect(() => {
    dispatchSettings({
      type: "UPDATE",
      payload: {
        show_demoBox: !demoBoxCollapsed,
      },
    });
  }, [demoBoxCollapsed, dispatchSettings]);

  const handleToggleDemoBox = () => {
    setDemoBoxCollapsed((prevValue) => {
      return !prevValue;
    });
  };

  /* Register the hotkey for DemoBox toggle */
  useHotkey(
    "toggleDemoBox",
    (e) => {
      e.preventDefault();
      handleToggleDemoBox();
    },
    null
  );

  /* Register the hotkeys for navigation 
  
  Set the enableOnTags prop to empty array so that this hotkey doesn't
  fire when an input is being typed in */
  useHotkey(
    "navigateNextGridDataElement",
    (e) => {
      e.preventDefault();
      onChangeGridDataElement(false);
    },
    { enableOnTags: [] }
  );

  useHotkey(
    "navigatePreviousGridDataElement",
    (e) => {
      e.preventDefault();
      onChangeGridDataElement(true);
    },
    { enableOnTags: [] }
  );

  /* 
  
  - - - - - - - - - RENDER/RETURN - - - - - - - - -
  
  */

  /* Renders the Toolbar associated with the Editor, includes
  Navigation arrows, Save, and Reset buttons */
  const renderToolbarTop = () => (
    <StyledToolbarTop variant="dense" isDirty={isDirty}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: "100px",
          }}
        >
          <StyledNavigateIconButton
            disabled={isDirty}
            disableRipple
            onClick={() => onChangeGridDataElement(true)}
          >
            <NavigateBeforeIcon
              sx={{ fontSize: "1.6rem", textShadow: "shadows.1" }}
            />
          </StyledNavigateIconButton>
          <Typography
            variant="h5"
            sx={{ fontSize: "1.2rem", color: "grey.200" }}
          >
            INDEX
          </Typography>
          <StyledNavigateIconButton
            disabled={isDirty}
            disableRipple
            onClick={() => onChangeGridDataElement(false)}
          >
            <NavigateNextIcon sx={{ fontSize: "1.6rem" }} />
          </StyledNavigateIconButton>
        </Box>
        <Tooltip
          title={
            (demoBoxCollapsed ? APP_TEXT.showDemoBox : APP_TEXT.hideDemoBox) +
            ` (${settings.hotkeys.toggleDemoBox})`
          }
          enterDelay={300}
        >
          <Switch
            size="small"
            checked={!demoBoxCollapsed}
            onChange={handleToggleDemoBox}
            color="default"
          />
        </Tooltip>
      </Stack>
      <Fade in={isDirty}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ButtonStandard
            sx={{
              maxHeight: "30px",
              color: "secondary.light",
            }}
            startIcon={
              <CircleIcon
                sx={{
                  color: "secondary.dark",
                }}
              />
            }
            disabled={!isDirty}
            secondary
            onClick={onClickSaveButton}
          >
            {APP_TEXT.editorSave}
          </ButtonStandard>
          <ButtonStandard
            sx={{
              maxHeight: "30px",
            }}
            disabled={!isDirty}
            secondary
            onClick={() => {
              reset();
            }}
          >
            {APP_TEXT.editorReset}
          </ButtonStandard>
        </Stack>
      </Fade>
    </StyledToolbarTop>
  );

  const renderToolbarBottom = () => (
    <StyledToolbarBottom variant="dense" isDirty={isDirty}>
      {isDirty && `Modified ("${settings.hotkeys.saveGridData}" to save)`}
    </StyledToolbarBottom>
  );

  if (currentGridDataObject) {
    return (
      <FormProvider {...form}>
        <DemoBox collapsed={demoBoxCollapsed} />
        <StyledGridContainer
          container
          isDirty={isDirty}
          addTopMargin={!demoBoxCollapsed}
        >
          <Grid item xs={12}>
            {renderToolbarTop()}
          </Grid>
          <Grid item xs={12}>
            <Editor control={control} />
          </Grid>
          <Grid item xs={12}>
            {renderToolbarBottom()}
          </Grid>
        </StyledGridContainer>
      </FormProvider>
    );
  } else {
    return <></>;
  }
};

/* EditorController.whyDidYouRender = {
  logOnDifferentValues: true,
}; */

export default EditorController;
