import * as React from "react";

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
  GridProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { useSelector, useDispatch } from "react-redux";
import { setDirty } from "./gridEditorSlice";
import { useSettings } from "../../global/Settings";

// Util
import { APP_TEXT } from "../../utils";

// Types
import { RootState } from "../../store";
import {
  TemplateElementId,
  GridDataObjectId,
} from "../../global/gridState.types";
interface EditorFormData {
  [key: TemplateElementId]: string;
}
interface EditorControllerProps {
  onNavigateGridDataObject: (reverse: boolean) => void;
  onSave: (data: EditorFormData) => boolean;
}

/* Styling */

// Types for props passed for styling
interface StyledFlags {
  isDirty?: boolean;
  addTopMargin?: boolean;
}

const StyledGridContainer = styled(Grid, {
  name: "EditorController",
  slot: "container",
  shouldForwardProp: (prop) => prop !== "isDirty" && prop !== "addTopMargin",
})<StyledFlags>(({ isDirty, addTopMargin, theme }) => ({
  borderRadius: "4px",
  boxShadow: theme.shadows[1],
  ...(isDirty && {
    boxShadow: theme.shadows[5],
  }),
  ...(addTopMargin && {
    marginTop: theme.spacing(1),
  }),
}));

const StyledToolbarTop = styled(Toolbar, {
  name: "EditorController",
  slot: "toolbar-top",
  shouldForwardProp: (prop) => prop !== "isDirty",
})<StyledFlags>(({ theme, isDirty }) => ({
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
})<StyledFlags>(({ theme, isDirty }) => ({
  minHeight: "32px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  fontSize: "0.85rem",
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
  onNavigateGridDataObject,
  onSave,
}: EditorControllerProps) => {
  const { settings, dispatchSettings } = useSettings(); // TODO: move to redux store
  const dispatch = useDispatch();

  const currentGridDataObject = useSelector(
    (state: RootState) => state.gridEditor.selectedGDO
  );

  const defaultFormValues = useSelector(
    (state: RootState) => state.gridEditor.defaultFormValues
  );

  const currentGridDataObjectIdRef = React.useRef<GridDataObjectId | null>(
    currentGridDataObject?.id ?? null
  );

  const form = useForm({
    defaultValues: { ...defaultFormValues },
  });

  const {
    control,
    reset,
    formState: { isDirty, isSubmitted, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = form;

  /* Reset the form to initial values when a different
  gridDataObject data comes through */
  React.useEffect(() => {
    /* Dont reset anything if currently submitting form */
    if (!isSubmitting && currentGridDataObject?.id) {
      /* A different gridDataObject has been selected */
      if (currentGridDataObjectIdRef.current !== currentGridDataObject.id) {
        reset({ ...defaultFormValues });
        currentGridDataObjectIdRef.current = currentGridDataObject.id;
      }
    }
  }, [reset, currentGridDataObject, defaultFormValues, isSubmitting]);

  /* Reset the formstate after a submit is successful */
  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...defaultFormValues }, { keepSubmitCount: true });
    }
  }, [
    reset,
    currentGridDataObject,
    defaultFormValues,
    isSubmitted,
    isSubmitSuccessful,
  ]);

  /* Track the form's isDirty status in our redux store (gridEditorSlice) */
  React.useEffect(() => {
    dispatch(setDirty(isDirty));
  }, [isDirty, dispatch]);

  /* Handles when the form passes validation after submit. This function
  will check for an 'id' key or create a new one, then send the data
  back to UpdatePage for saving. */
  const onSubmitValid = React.useCallback(
    async (data) => {
      console.log("submitted data", data); //! DEBUG

      /* Send to UpdatePage for saving via "onSave" callback. "data" is the Editor's gridDataObject's data */
      const res = await onSave(data);
      if (!res) {
        throw new Error(
          "unsuccessful save (could be error or canceled by the user)"
        );
      }
    },
    [onSave]
  );

  const onSubmitError = React.useCallback((error) => {
    console.error("Submission error", error);
  }, []);

  /* The save process can be initiated by save button click or hotkey */
  const onSaveInitiation = (e?: React.SyntheticEvent) => {
    handleSubmit(
      onSubmitValid,
      onSubmitError
    )(e).catch((error) => {
      console.warn("Save was aborted.", error);
    }); //curried
  };

  /* 
  This handles the Save button. It prevents the html form submission
  See https://github.com/react-hook-form/react-hook-form/issues/1025#issuecomment-585652414
  */
  const onClickSaveButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onSaveInitiation(e);
  };

  /* Perform the form submit when the hotkey save action fires */
  const handleHotkeySave = (e: KeyboardEvent) => {
    e.preventDefault();
    /* Only try to submit form if form is dirty */
    if (isDirty) {
      onSaveInitiation();
    }
  };

  /* Register the save hotkey. The callback is memoized within, but
  we pass isDirty as a dependency array to avoid stale closure. */
  useHotkey("saveGridData", handleHotkeySave, undefined, [
    isDirty,
    onSaveInitiation,
  ]);

  /* DemoBox show/hide */
  /* Track the toggle state of DemoBox */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = React.useState(
    !settings.show_demoBox
  );

  /* Update the user settings when DemoBox toggle changes */
  React.useEffect(() => {
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
  useHotkey("toggleDemoBox", (e) => {
    e.preventDefault();
    handleToggleDemoBox();
  });

  /* Register the hotkeys for navigation 
  
  Set the enableOnTags prop to empty array so that this hotkey doesn't
  fire when an input is being typed in */
  useHotkey(
    "navigateNextGridDataElement",
    (e) => {
      e.preventDefault();
      onNavigateGridDataObject(false);
    },
    { enableOnTags: [] }
  );

  useHotkey(
    "navigatePreviousGridDataElement",
    (e) => {
      e.preventDefault();
      onNavigateGridDataObject(true);
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
            onClick={() => onNavigateGridDataObject(true)}
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
            onClick={() => onNavigateGridDataObject(false)}
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
