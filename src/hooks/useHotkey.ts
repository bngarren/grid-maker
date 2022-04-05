import { KeyHandler } from "hotkeys-js";
import { useHotkeys, Options } from "react-hotkeys-hook";
import useUserHotkeys from "./useUserHotkey";
/**
 * This is our app's custom hook for registering a hotkey which
 * essentially wraps the functionality of the react-hotkeys-hook
 * module and incorporates our own useUserHotkey hook which grabs
 * the key combo from user settings.
 * @param {string} hotkeyAction Should use the custom useUserHotkeys hook to get the key/keystroke
 * from user settings
 * @param {func} handler Callback function that fires on hotkey activation
 * @param {Object} options Custom options to pass to useHotKeys (react-hotkeys-hook).
 * By default, we enable hotkey activation within inputs and only keyDown events.
 * @param {Object[]} deps Dependency array that needs to keep the memoized handler non-stale
 */
const useHotkey = (
  hotkeyAction: string,
  handler: KeyHandler,
  options?: Options | undefined,
  deps?: any[] | undefined //eslint-disable-line
): void => {
  if (hotkeyAction == null) {
    console.error("Could not register hotkey", hotkeyAction);
  }

  /* Register this hotkey, based on user-defined key combo */
  useHotkeys(
    useUserHotkeys(hotkeyAction) ?? "",
    handler,
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"], // allow hotkey within inputs
      keydown: true,
      ...options,
    },
    deps
  );
};

export default useHotkey;
