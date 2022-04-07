export const DEFAULT_GRID_DATA_ELEMENT_DATA = {
  // id: "", id is dynamically added/removed
  location: "",
  lastName: "",
  firstName: "",
  team: "",
  summary: "",
  contingencies: [],
  contentType: "simple",
  simpleContent: "",
  nestedContent: [],
  bottomText: "",
};
export const TEST_GRID_DATA = [
  {
    // id: "", Does not include 'id' for testing purposes
    location: "4",
    lastName: "Leffingwell",
    firstName: "Keira",
    team: "2",
    summary:
      "3yo ex 23 wk F with CLD, Pulm vein stenosis, SGS, Trach, nocturnal vent, here with hypoxemia, worse PVS, and pulm HTN and RV dysfunction",
    contingencies: ["Pulm HTN"],
    contentType: "simple",
    simpleContent:
      "R - baseline Trach collar 1-2 L, night time PSV 10/7\nCV - acute on chronic pulm HTN, sildenafil\n   [ ] Plan for cath intervention\nGI - Gtube feeds\nID - none\nH - home ASA\nSocial - parents moved to Boston, no housing",
    nestedContent: [],
    bottomText: "",
  },
];

export const EXAMPLE_SNIPPETS = [
  { key: "sedation", content: "Mo, Mz, Dex gtts" },
  { key: "systems", content: "NEURO:\nRESP:\nCV:\nFEN:\nID:\nHEME:\nENDO:" },
  { key: "crit airway", content: "*CRITICAL AIRWAY*" },
  { key: "crit brain", content: "*CRITICAL BRAIN*" },
  { key: "no ecmo", content: "*NO ECMO*" },
  { key: "ORL STAT", content: "*ORL STAT*" },
  { key: "GT feeds", content: "GT full feeds" },
  { key: "SDS contingency", content: "would need SDS" },
];

export const DEFAULT_HOTKEYS = {
  navigateNextGridDataElement: "shift+.",
  navigatePreviousGridDataElement: "shift+,",
  saveGridData: "ctrl+s",
  toggleDemoBox: "ctrl+d",
};

export const DEFAULT_SETTINGS = {
  document_cols_per_page: 4,
  document_title: "",
  export_filename: "grid",
  contingencyOptions: [
    "Critical Airway",
    "Critical Brain",
    "Difficult Airway",
    "ORL STAT",
    "Anesthesia STAT",
    "No ECMO",
    "DNR/DNI",
    "Modified DNR",
    "Comfort measures only",
    "Pulm HTN",
  ],
  show_demoBox: false,
  hotkeys: {
    ...DEFAULT_HOTKEYS,
  },
};

export const APP_TEXT = {
  addGridDataElement: "Add item",
  addFirstGridDataObjectPrompt: "Add the first item to your grid below.",
  editorSave: "Save",
  editorReset: "Reset",
  hideDemoBox: "Hide example",
  indexElementCannotBeEmpty: "The index cannot be empty.",
  showDemoBox: "Show example",
};
