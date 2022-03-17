import * as React from "react";

// MUI
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/system";
import StopIcon from "@mui/icons-material/Stop";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";

// Components
import { ButtonStandard } from "../../components";

// React Movable
import { List as MovableList, arrayMove } from "react-movable";

// Util
import { v4 as uuidv4 } from "uuid";

/* Styling */

const StyledRoot = styled(Box, {
  name: "NestedContentInput",
  slot: "root",
})(({ theme, sectionIsSelected }) => ({
  paddingTop: theme.spacing(1),
}));

const StyledMovableLi = styled("li", {
  name: "ContentInput",
  slot: "li",
})(({ theme }) => ({
  listStyleType: "none",
}));

/**
 * This component should be wrapped by a Controller (from react-hook-form) so
 * that it can be hooked into the Editor form. Within this component we can make
 * changes to nestedContent array data (an array of sections) either by adding,
 * removing, changing order, or editing the section content. Any of these changes
 * will make the nestedContent field of the form dirty.
 *
 */
const NestedContentInput = ({
  data,
  onChange,
  inputRef,
  fieldState,
  formState,
}) => {
  // store the selected section id. Should be null if no section selected
  const [selectedSectionId, setSelectedSectionId] = React.useState(null);

  /* Know if a section is dirty (changes have not been accepted),
  because we will prevent changing to a new section before this is dealt with */
  const [sectionIsDirty, setSectionIsDirty] = React.useState(false);

  /* Get rid of any selected section */
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      setSelectedSectionId(null);
    }
  }, [formState]);

  /* Used by react-movable onChange callback */
  const handleMoveSection = React.useCallback(
    ({ oldIndex, newIndex }) => {
      onChange(arrayMove(data, oldIndex, newIndex));
    },
    [onChange, data]
  );

  /* The callback that is passed to each Section so we know
  when a Section's data has changed */
  const handleModifiedSection = React.useCallback(
    (modifiedSection) => {
      /* Return a new nestedContent array with the 
      modified section data */
      const newData = data.map((section) =>
        section.id !== modifiedSection.id ? section : modifiedSection
      );
      onChange(newData);
    },
    [onChange, data]
  );

  /* Remove a section, by id */
  const handleRemoveSection = React.useCallback(
    (e, id) => {
      e.stopPropagation();
      let newData = [...data];
      const index = data.findIndex((el) => el.id === id);
      if (index === -1) return;

      newData.splice(index, 1);

      onChange(newData);

      if (selectedSectionId === id) {
        setSelectedSectionId(null);
      }
    },
    [onChange, selectedSectionId, data]
  );

  const handleOnClickSection = React.useCallback(
    (id) => {
      /* Don't change to a new section if another section is dirty 
    TODO: Should have a modal or animation here?
    */
      if (sectionIsDirty) {
        return;
      }
      setSelectedSectionId((prev) => {
        return prev === id ? prev : id;
      });
    },
    [sectionIsDirty]
  );

  const clearSelectedSection = React.useCallback(() => {
    setSelectedSectionId(null);
  }, []);

  return (
    <StyledRoot>
      {data?.length > 0 ? (
        <MovableList
          values={data}
          onChange={handleMoveSection}
          lockVertically={true}
          renderList={({ children, props }) => (
            <List ref={inputRef} sx={{ p: 0 }} {...props}>
              {children}
            </List>
          )}
          renderItem={({
            value: section,
            index,
            props: { onKeyDown, tabIndex, ...props }, // We pull out onKeyDown because we don't want to use keyboard events
            isDragged,
          }) => (
            <StyledMovableLi
              {...props}
              aria-roledescription={`section at position ${index + 1}`}
            >
              <Section
                tabIndex={tabIndex}
                section={section}
                selected={selectedSectionId === section.id}
                subdued={
                  /* a section is selected, but not this one */
                  selectedSectionId != null && selectedSectionId !== section.id
                }
                isDragged={isDragged}
                onClickSection={handleOnClickSection}
                onDeselectSection={clearSelectedSection}
                onRemoveSection={handleRemoveSection}
                onModifiedSection={handleModifiedSection}
                toggleDirty={setSectionIsDirty}
              />
            </StyledMovableLi>
          )}
        />
      ) : (
        <></>
      )}
    </StyledRoot>
  );
};
export default NestedContentInput;

/* Styling for Section */

const StyledSectionRoot = styled(Stack, {
  name: "Section",
  slot: "Root",
  shouldForwardProp: (prop) =>
    prop !== "subdued" &&
    prop !== "isDragged" &&
    prop !== "selected" &&
    prop !== "isDirty",
})(({ theme, selected, subdued, isDragged, isDirty }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginTop: "3px",
  marginBottom: "3px",
  cursor: selected ? "default" : "pointer",
  // Sections that aren't selected should be subdued in appearance
  opacity: subdued ? "0.3" : "1",

  /* Tabbed and focused - don't show border if already selected */
  "&:focus-visible": {
    outline: selected ? "none" : `1px solid ${theme.palette.primary.light}`,
  },

  // Show a hovering color, unless currently being dragged or is selected
  "&:hover": {
    backgroundColor:
      isDragged || selected ? "transparent" : theme.palette.grey[100],
  },
  // Show drag indicator on hover, but not if currently subdued, i.e. non-selected
  "&:hover .drag-indicator": {
    visibility: subdued ? "none" : "inherit",
    opacity: 1,
  },
  ...(selected && {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: "3px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "8px",
  }),

  /* When dragged, add some emphasis */
  ...(isDragged && {
    border: `1px dotted ${theme.palette.grey[300]}`,
  }),
}));

const StyledSectionContent = styled(Stack, {
  name: "Section",
  slot: "content",
  shouldForwardProp: (prop) => prop !== "selected",
})(({ selected }) => ({
  width: "100%",
  paddingBottom: "15px",
}));

const StyledSectionTopBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  justifyContent: "flex-start",
}));

const StyledListItem = styled(ListItem, {
  name: "Section",
  slot: "listItem",
})(({ theme }) => ({
  width: "100%",
  paddingTop: 0,
}));

const StyledTextField = styled(TextField, {
  name: "Section",
  slot: "textfield",
  shouldForwardProp: (prop) => prop !== "isDragged",
})(({ theme, value, isDragged }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "0px 6px",
    borderRadius: "2px",
    "& fieldset": {
      // Baseline border -- only when empty
      borderColor: value ? "transparent" : theme.palette.grey[200],
    },
    // Emphasize border on hover if empty
    "&:hover fieldset": {
      borderColor: !value ? theme.palette.primary.light : "transparent",
    },
    "&.Mui-focused fieldset": {
      // Focused border
      borderWidth: "0.1em",
      borderColor: theme.palette.primary.main,
      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: theme.typography.formFontSizeLevel2,
    padding: "3px 8px",
  },

  /* When dragged, add some emphasis */
  ...(isDragged && {
    border: `1px dotted ${theme.palette.grey[300]}`,
  }),
}));

const StyledSectionButtons = styled(Stack, {
  name: "ContentInput",
  slot: "buttons",
})(({ theme }) => ({
  justifyContent: "space-between",
}));

const Section = ({
  tabIndex,
  section,
  selected,
  isDragged,
  subdued,
  onClickSection = (f) => f,
  onDeselectSection = (f) => f,
  onRemoveSection = (f) => f,
  onModifiedSection = (f) => f,
  toggleDirty = (f) => f,
}) => {
  const [inputTitle, setInputTitle] = React.useState(section.title || "");
  const [inputTop, setInputTop] = React.useState(section.top || "");
  const [inputItems, setInputItems] = React.useState(section.items || []);

  /* An input is considered dirty if the changes have not been sent back up to 
  NestedContentInput and let the rest of the Editor form know about this
  changed Section and thus changed nestedContent value 
  
  Notably, isDirty will be reset to false if the parent component knows
  about this new value even if this change hasn't been "saved" to GridState (gridData) yet. 
  So, it is still "dirty" from an unsaved gridData perspective, but no longer
  dirty from a Section input standpoint
  */
  const [isDirty, setIsDirty] = React.useState(false);

  const { title, top } = section;
  const isEmpty = !title && !top && section.items.length < 1;

  /* Match our input values to any new section data coming through */
  React.useEffect(() => {
    setInputTitle(section.title || "");
    setInputTop(section.top || "");
    setInputItems(section.items || []);
  }, [section]);

  /* Track which inputs currently differ from the parent section data */
  React.useEffect(() => {
    setIsDirty(
      inputTitle !== section.title ||
        inputTop !== section.top ||
        JSON.stringify(inputItems) !== JSON.stringify(section.items)
    );
  }, [inputTitle, inputTop, inputItems, isDirty, section]);

  React.useEffect(() => {
    toggleDirty(isDirty);
  }, [isDirty, toggleDirty]);

  const handleOnClickSection = () => {
    if (!selected) {
      onClickSection(section.id);
    }
  };

  const onAcceptChanges = (e) => {
    const sectionData = {
      id: section.id,
      title: inputTitle,
      top: inputTop,
      items: inputItems,
    };
    onModifiedSection(sectionData);
    onDeselectSection();
  };

  const onCancel = () => {
    setInputTitle(section.title || "");
    setInputTop(section.top || "");
    setInputItems(section.items || []);
    onDeselectSection();
  };

  /* Track the last input item field so it can obtain focus
  when adding new items */
  const lastInputItem = React.useRef();

  const handleAddItem = () => {
    const newItem = {
      id: uuidv4(),
      content: "",
    };
    setInputItems((prev) => prev.concat([newItem]));
  };

  /* Focus the last input item */
  React.useEffect(() => {
    lastInputItem.current?.focus();
  }, [inputItems.length]);

  const handleMoveItem = React.useCallback(({ oldIndex, newIndex }) => {
    setInputItems((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  /* A textfield for a given item has changed and thus we update the
  entire items array to reflect this new value
  ! Potential to be slow 
  */
  const handleModifyItem = (e, itemIndex) => {
    const itemValue = e.target.value;
    setInputItems((prev) => {
      let newItemsArray = [...prev];
      newItemsArray[itemIndex] = { ...prev[itemIndex], content: itemValue };
      return newItemsArray || prev;
    });
  };

  const handleKeyDownItemInput = (e, itemIndex) => {
    const key = e.key;
    if (key !== "Enter") {
      return;
    }
    // only adds a new item if we press enter on the last input
    if (itemIndex === inputItems.length - 1) {
      handleAddItem();
    }
  };

  const handleRemoveItem = (itemIndex) => {
    setInputItems((prev) => {
      let newItemsArray = [...prev];
      newItemsArray.splice(itemIndex, 1);
      return newItemsArray;
    });
  };

  const renderTopBox = () => {
    if (selected) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}>
            <StyledTextField
              size="small"
              variant="outlined"
              fullWidth
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-input": {
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    :
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs lg>
            <StyledTextField
              size="small"
              variant="outlined"
              fullWidth
              value={inputTop}
              onChange={(e) => setInputTop(e.target.value)}
            />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <StyledSectionTopBox>
          <Typography
            sx={{
              fontSize: "formFontSizeLevel3",
              lineHeight: "1",
              whiteSpace: "pre-line",
              width: "100%",
              marginBottom: "2px",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "formFontSizeLevel2",
                fontWeight: "bold",
                marginRight: "5px",
                ...(isEmpty === true && {
                  fontWeight: "normal",
                  letterSpacing: "1.2px",
                }),
              }}
            >
              {title && `${title}:`}
              {isEmpty && "[empty section]"}
            </Typography>
            {top}
          </Typography>
        </StyledSectionTopBox>
      );
    }
  };

  const renderItemList = () => {
    if (selected) {
      return (
        <Box>
          <MovableList
            values={inputItems}
            onChange={handleMoveItem}
            lockVertically={true}
            renderList={({ children, props }) => (
              <List sx={{ p: 0 }} {...props}>
                {children}
              </List>
            )}
            renderItem={({
              value: item,
              index,
              props: { onKeyDown, tabIndex, ...props },
              isDragged,
            }) => (
              <StyledListItem
                {...props}
                aria-roledescription={`item at position ${index + 1}`}
                sx={{ padding: "2px 8px 0px 16px" }}
              >
                <StyledTextField
                  value={item.content}
                  size="small"
                  variant="outlined"
                  fullWidth
                  isDragged={isDragged}
                  onChange={(e) => handleModifyItem(e, index)}
                  onKeyDown={(e) => handleKeyDownItemInput(e, index)}
                  inputProps={{
                    tabIndex: tabIndex,
                    ref:
                      index === inputItems.length - 1
                        ? lastInputItem
                        : undefined,
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: !isDragged && "grey.50",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <StopIcon
                        sx={{ fontSize: "0.7rem", color: "primary.light" }}
                      />
                    ),
                    endAdornment: (
                      <Stack direction="row" spacing={1}>
                        <DragIndicatorIcon
                          data-movable-handle
                          className="drag-indicator"
                          sx={{
                            fontSize: "1.3rem",
                            color: "grey.500",
                            "&:hover": {
                              color: "primary.light",
                            },
                            cursor: isDragged ? "grabbing" : "grab",
                          }}
                        />
                        <IconButton
                          sx={{ padding: "2px" }}
                          onClick={() => handleRemoveItem(index)}
                        >
                          <RemoveCircleIcon
                            sx={{
                              fontSize: "1rem",
                              "&:hover": {
                                color: "primary.light",
                              },
                            }}
                          />
                        </IconButton>
                      </Stack>
                    ),
                  }}
                />
              </StyledListItem>
            )}
          />
        </Box>
      );
    } else {
      return (
        <List component="ul" disablePadding>
          {section.items &&
            section.items.length > 0 &&
            section.items.map((item) => {
              const itemText = item.content !== "" ? item.content : "";
              return (
                <ListItem
                  sx={{
                    padding: "1px 0 1px 8px",
                  }}
                  key={item.id}
                >
                  <StopIcon
                    sx={{ fontSize: "0.8rem", color: "primary.light" }}
                  />
                  <ListItemText
                    primary={itemText}
                    sx={{
                      margin: "0",
                      paddingLeft: "3px",
                      "& .MuiListItemText-primary": {
                        fontSize: "formFontSizeLevel3",
                        lineHeight: "1",
                      },
                    }}
                  />
                </ListItem>
              );
            })}
        </List>
      );
    }
  };

  return (
    <StyledSectionRoot
      tabIndex={tabIndex}
      onClick={handleOnClickSection}
      direction="column"
      selected={selected}
      subdued={subdued}
      isDragged={isDragged}
      isDirty={isDirty}
    >
      <Stack direction="row">
        <DragIndicatorIcon
          data-movable-handle
          className="drag-indicator"
          sx={{
            fontSize: "1.3rem",
            color: "grey.500",
            "&:hover": {
              color: "primary.light",
            },
            cursor: isDragged ? "grabbing" : "grab",
            // hidden until SectionContainer is hovered
            visibility: "hidden",
            opacity: 0,
            transition: "visibility 0s linear 0s, opacity 300ms",
            display: selected && "none",
          }}
        />
        <StyledSectionContent direction="column" selected={selected}>
          {renderTopBox()}
          {renderItemList()}
        </StyledSectionContent>
      </Stack>
      {selected && (
        <StyledSectionButtons direction="row">
          <IconButton
            onClick={handleAddItem}
            aria-label="add item"
            sx={{ padding: "4px" }}
          >
            <AddBoxIcon sx={{ color: "primary.light" }} />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => onRemoveSection(e, section.id)}
              aria-label="delete section"
              sx={{ padding: "4px" }}
            >
              <DeleteIcon sx={{ color: "warning" }} />
            </IconButton>
            <ButtonStandard secondary onClick={onCancel}>
              {isDirty ? "Cancel" : "Close"}
            </ButtonStandard>
            <Collapse orientation="horizontal" in={isDirty}>
              <ButtonStandard onClick={onAcceptChanges}>Accept</ButtonStandard>
            </Collapse>
          </Stack>
        </StyledSectionButtons>
      )}
    </StyledSectionRoot>
  );
};
