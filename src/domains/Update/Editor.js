import { useEffect, useCallback, useRef, memo } from "react";

// MUI
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/system";

import { usePopupState } from "material-ui-popup-state/hooks";

// React-hook-form
import { Controller } from "react-hook-form";

// Components
import EditorTextField from "./EditorTextField";
import ContentInput from "./ContentInput";
import ContingencyInput from "./ContingencyInput";
import SnippetPopover from "./SnippetPopover";

// Context
import { useSettings } from "../../global/Settings";

// Redux
import { useSelector } from "react-redux";

// Util
import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

/* Styling */

const StyledEditorRoot = styled(Box, {
  name: "Editor",
  slot: "Root",
})(({ theme }) => ({
  padding: "20px 20px 20px 20px",
  backgroundColor: theme.palette.grey[50],
}));

const Editor = ({ control }) => {
  const { settings } = useSettings();

  const currentGridDataObject = useSelector(
    (state) => state.gridEditor.selectedGDO
  );
  const template = useSelector((state) => state.gridState.template);

  /* Ref to last name input field, so we can focus() here when a gridDataElement is selected */
  const lastNameInputRef = useRef();

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const lastCursorPos = useRef({
    pos: null,
    element: null,
  });

  /* The user has selected a snippet to insert */

  const onSnippetSelected = (snippet) => {
    // Insert the snippet at the position our caret was at when the snippet was chosen
    /*  insertSnippet(
      snippet,
      lastCursorPos.current.element,
      lastCursorPos.current.pos
    ); */

    // Recalculate where our caret should be after the snippet is inserted
    lastCursorPos.current = {
      ...lastCursorPos.current,
      pos: {
        start: lastCursorPos.current.pos.start + snippet.length,
        end: lastCursorPos.current.pos.start + snippet.length,
      },
    };

    /* setTimeout is a hacky way to get the focus to work correctly... */
    window.setTimeout(() => {
      setCursorPos(
        document.getElementById(lastCursorPos.current.element.id),
        lastCursorPos.current.pos.start,
        lastCursorPos.current.pos.end
      );
    }, 0);
  };

  /* const insertSnippet = useCallback(
    (snippet, element, pos) => {
      let currentText = element.value;
      let newText =
        currentText.substring(0, pos.start) +
        snippet +
        currentText.substring(pos.end);
      handleInputChange(element.id, newText);
    },
    [handleInputChange]
  ); */

  /* How the snippet popover is triggered  */
  const handleKeyDown = useCallback(
    (event) => {
      let key = event.key;
      let element = document.activeElement;
      let elementId = element.id;

      if (key === "Control") {
        // do nothing when only Control key is pressed.
        return;
      }
      let keyIsSpacebar =
        key === " " ||
        key === "Space" ||
        key === "Spacebar" ||
        event.code === "Space";

      // this is the CTRL + SPACEBAR combination
      if (keyIsSpacebar && event.ctrlKey) {
        if (elementId === "summary" || elementId === "simpleContent") {
          console.log(`Popover event triggered from element = ${elementId}`);

          // Don't let the CTRL or SPACEBAR keydown do anything else
          event.stopPropagation();

          /* Store the cursor position and HTML element from which the snippet popup
          was triggered so that we know where to insert the snippet */
          let pos = getCursorPos(element);
          lastCursorPos.current = { pos, element };

          popupState.open(element);
        }
      }
    },
    [popupState]
  );

  /* Key down listener to activate the Popover */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /*  - - - - - RETURN - - - -  */
  return (
    <StyledEditorRoot>
      <form id="editor" autoComplete="off" spellCheck="false">
        <Stack direction="column" spacing={2}>
          {template.rows.allIds?.map((rowId) => (
            <Stack direction="row" spacing={1} key={rowId}>
              {template.rows.byId[rowId]?.elements.map((rel) => {
                const templateElement = template.elements.byId[rel];
                return (
                  <Controller
                    key={rel}
                    control={control}
                    name={templateElement.id}
                    render={({ field }) => (
                      <EditorTextField
                        label={templateElement.name}
                        width={templateElement.widthPercent}
                        multiline={template.rows.byId[rowId].fillHeight}
                        minRows={2}
                        {...field}
                      />
                    )}
                  />
                );
              })}
            </Stack>
          ))}
        </Stack>
      </form>
      <SnippetPopover popupState={popupState} onSelect={onSnippetSelected} />
    </StyledEditorRoot>
  );
};

export default memo(Editor);
