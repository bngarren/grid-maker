// Context
import { useSettings } from "../global/Settings";

/**
 * Custom hook that returns the keystroke/key of a given action from our settings
 * @param {string} action This is the action we want to register, e.g. "save", and should
 * be defined in our hotkeys object in the Settings context.
 * E.g., { save: "ctrl+s" }
 * @returns hotkey (string)
 */
const useUserHotkey = (action: string): string | undefined => {
  const { settings } = useSettings();
  let hotkey;
  try {
    if (action in settings.hotkeys) {
      hotkey = settings.hotkeys[action];
    } else {
      throw new Error(`${action} does not exist in hotkeys`);
    }
  } catch (error) {
    console.log("useUserHotkey", error);
  }
  return hotkey;
};

export default useUserHotkey;
