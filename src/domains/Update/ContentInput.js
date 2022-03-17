import * as React from "react";

// MUI
import { Grid, Box, Stack, Typography, OutlinedInput } from "@mui/material";
import { styled } from "@mui/system";

// React-hook-form
import { Controller, useFormState, useFormContext } from "react-hook-form";

// Components
import ContentInputToolbar from "./ContentInputToolbar";
import NestedContentInput from "./NestedContentInput";
import CustomLabel from "./CustomLabel";

// Util
import { v4 as uuidv4 } from "uuid";
import { forOwn } from "lodash-es";

/* Styling - ContentInput */

const StyledRoot = styled(Box, {
  name: "ContentInput",
  slot: "Root",
})(({ theme }) => ({
  position: "relative",
  backgroundColor: "white",
  padding: 0,
  minHeight: "250px",
  border: "1px solid rgba(0, 0, 0, 0.23)", //to match mui outlined input
  borderRadius: "4px",
}));

const StyledContentInputContainer = styled(Grid, {
  name: "ContentInput",
  slot: "contentInput",
})(({ theme }) => ({
  flexDirection: "row",
  flex: "2",
}));

/**
 * ContentInput
 * This component renders either the "simpleContent" input--which is just a standard
 * textfield input, or the "nestedContent" input--which is a more complex component
 * that allows for structuring the input data into sections and items, to make for
 * a more compact layout in the actual grid.
 *
 */
const ContentInput = () => {
  const {
    control,
    setValue,
    getValues,
    watch,
    unregister,
    formState: { dirtyFields },
  } = useFormContext();

  /* want to know if the content type has been changed in the toolbar
  so we can display the correct one, i.e. simple versus nested */
  const contentType = watch("contentType");

  /* Since our contentType is toggled and the components are unmounted, 
  we use the RHF unregister function each time contentType changes. Prior to this fix,
  there was a bug with the field values getting mixed up between simple vs nestedContent */
  React.useEffect(() => {
    if (contentType === "simple") {
      unregister("nestedContent", { keepDefaultValue: true, keepValue: true });
    }
    if (contentType === "nested") {
      unregister("simpleContent", { keepDefaultValue: true, keepValue: true });
    }
  }, [contentType, unregister]);

  /* Tracks whether any of these fields have become dirty */
  /*//! using isDirty rather than dirtyFields did not work... */
  let contentInputIsDirty = false;
  forOwn(dirtyFields, (_, key) => {
    if (["contentType", "simpleContent", "nestedContent"].includes(key)) {
      contentInputIsDirty = true;
      return false;
    }
  });

  const handleOnAddSection = React.useCallback(
    (value) => {
      const current = getValues("nestedContent");
      const newSection = {
        id: uuidv4(),
        title: value || "",
        top: "",
        items: [],
      };

      let result;
      if (Array.isArray(current)) {
        result = current.concat([newSection]);
      } else {
        result = [newSection];
      }
      setValue("nestedContent", result, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleOnSelectTemplate = React.useCallback(
    (value) => {
      /* create a new nestedContent array based on the template */
      let newNestedContent = [];
      if (Array.isArray(value)) {
        value.forEach((el) => {
          newNestedContent.push({
            id: uuidv4(),
            title: el || "",
            top: "",
            items: [],
          });
        });
      }

      setValue("nestedContent", newNestedContent, { shouldDirty: true });
    },
    [setValue]
  );

  return (
    <Box>
      <CustomLabel label="Content" isDirty={contentInputIsDirty} />
      <StyledRoot tabIndex={-1}>
        <ContentInputToolbar
          control={control}
          contentType={contentType}
          onAddSection={handleOnAddSection}
          onSelectTemplate={handleOnSelectTemplate}
        />
        <StyledContentInputContainer>
          {contentType === "simple" && (
            <Controller
              name="simpleContent"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  fullWidth
                  placeholder="Enter some information here"
                  multiline
                  minRows={10}
                  maxRows={20}
                  sx={{
                    lineHeight: "1.5em",
                    backgroundColor: "white",
                    "& fieldset": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "formFontSizeLevel1",
                    },
                    "&.MuiInputBase-multiline": {
                      padding: "10px 4px 5px 12px",
                    },
                  }}
                  {...field}
                />
              )}
            />
          )}

          {contentType === "nested" && (
            <Controller
              control={control}
              name="nestedContent"
              render={({
                field: { value, onChange, ref },
                fieldState,
                formState,
              }) => {
                return (
                  <NestedContentInput
                    data={value}
                    onChange={onChange}
                    inputRef={ref}
                    fieldState={fieldState}
                    formState={formState}
                  />
                );
              }}
            />
          )}
        </StyledContentInputContainer>
      </StyledRoot>
    </Box>
  );
};

/* ContentInput.whyDidYouRender = {
  logOnDifferentValues: true,
}; */

export default React.memo(ContentInput);
