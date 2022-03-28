import * as React from "react";
const useStable = (value) => {
  const ref = React.useRef(value);
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  return React.useCallback(() => ref.current, [ref]);
};
export default useStable;
