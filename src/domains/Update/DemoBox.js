// MUI
import { Box, Paper, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/system";
import StopIcon from "@mui/icons-material/Stop";

// React hook form
import { useWatch } from "react-hook-form";

// Context and utility
import { useSettings } from "../../global/Settings";
import { getWidth } from "../Document/MyDocument";

/* Styling */
const StyledPaperRoot = styled(Paper, {
  name: "DemoBox",
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "convertedWidth",
})(({ theme, convertedWidth }) => ({
  position: "relative",
  backgroundColor: "white",
  height: "250pt",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  fontSize: "9pt",
  fontFamily: "Roboto",
  minWidth: convertedWidth,
  maxWidth: convertedWidth,
}));

const StyledHeaderBox = styled(Box, {
  name: "DemoBox",
  slot: "header",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  borderBottom: `1pt solid ${theme.palette.primary.main}`,
}));

const StyledBodyBox = styled(Box, {
  name: "DemoBox",
  slot: "body",
})(() => ({
  fontSize: "7.5pt",
  padding: "3px 7px 7px 3px",
  whiteSpace: "pre-line",
  lineHeight: "0.75rem",
}));

const StyledNestedContentBox = styled(Box, {
  name: "DemoBox",
  slot: "nestedContent",
})(() => ({
  marginTop: "3px",
  fontSize: "8pt",
}));

/* The demo grid box used for displaying what the grid box might look like */
const DemoBox = ({ collapsed }) => {
  const { settings } = useSettings();

  /* react-hook-form */
  const data = useWatch([
    "location",
    "lastName",
    "firstName",
    "team",
    "summary",
    "contentType",
    "simpleContent",
    "nestedContent",
    "bottomText",
  ]);

  const renderNameComma = () => {
    if (data.lastName && data.firstName) {
      return ", ";
    }
  };

  const convertedWidth = getWidth(settings.document_cols_per_page, 1.15);

  return (
    <>
      <Collapse in={!collapsed}>
        <Box
          sx={{
            /* Constrains the DemoBox and regulates scroll bar
            Important so that when gridsPerRow is 1, this wide box
            doesn't take up so much space but instead overflows  */
            margin: "auto",
            overflow: settings.document_cols_per_page > 1 ? "hidden" : "auto",
            maxWidth: {
              xs: convertedWidth,
              md: `min(50vw, ${convertedWidth})`,
            },
          }}
        >
          <StyledPaperRoot convertedWidth={convertedWidth}>
            <StyledHeaderBox>
              <Box
                sx={{
                  marginRight: "4px",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                  borderRight: "1px solid black",
                  fontWeight: "bold",
                }}
              >
                {data.location}
              </Box>
              <Box sx={{ flexGrow: "1" }}>
                {data.lastName}
                {renderNameComma()}
                {data.firstName}
              </Box>
              <Box
                sx={{
                  marginLeft: "4px",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                  borderLeft: "1px solid black",
                }}
              >
                {data.team}
              </Box>
            </StyledHeaderBox>
            <StyledBodyBox>
              <Box
                sx={{
                  fontSize: "8.25pt",
                  marginBottom: "2px",
                }}
              >
                {data.summary}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "7pt",
                  fontWeight: "bold",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  alignContent: "center",
                  marginBottom: "4px",
                }}
              >
                {data.contingencies &&
                  data.contingencies.map((item, index) => {
                    return (
                      <Box
                        sx={{
                          border: "1pt solid #9a9a9a",
                          borderRadius: "2pt",
                          padding: "0 2px 0px 2px",
                          marginTop: "1pt",
                          marginRight: "2pt",
                        }}
                        key={`${item}-${index}`}
                      >
                        {item}
                      </Box>
                    );
                  })}
              </Box>
              {data.contentType === "simple" && data.simpleContent}
              {data.contentType === "nested" &&
                data.nestedContent?.map((sectionData) => {
                  return (
                    <StyledNestedContentBox key={sectionData.id}>
                      <Box sx={{ minHeight: "6.25pt" }}>
                        {sectionData.title && (
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              fontSize: "8pt",
                              fontWeight: "bold",
                              marginRight: "2px",
                            }}
                          >
                            {`${sectionData.title}:`}
                          </Typography>
                        )}
                        {sectionData.top}
                      </Box>
                      {sectionData?.items?.map((item) => {
                        return (
                          <Box
                            key={item.id}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              marginLeft: "4pt",
                            }}
                          >
                            <StopIcon style={{ fontSize: "8pt" }} />
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                marginLeft: "1.5pt",
                                fontSize: "7.8pt",
                              }}
                            >
                              {item.content}
                            </Typography>
                          </Box>
                        );
                      })}
                    </StyledNestedContentBox>
                  );
                })}
            </StyledBodyBox>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                textAlign: "right",
                fontSize: "8pt",
                padding: "2pt 4pt 2pt 2pt",
              }}
            >
              {data.bottomText}
            </Box>
          </StyledPaperRoot>
        </Box>
      </Collapse>
    </>
  );
};

export default DemoBox;
