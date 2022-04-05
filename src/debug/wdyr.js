import React from "react";
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
