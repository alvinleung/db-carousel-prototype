import { useLayoutEffect, useState } from "react";
import { useEventListener } from "usehooks-ts";

type InputMode = "touch" | "mouse" | undefined;

export function useInputMode() {
  const [inputMode, setInputMode] = useState<InputMode>(undefined);

  // use the media query value as a default
  useLayoutEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      setInputMode("touch");
      return;
    }

    setInputMode("mouse");
  }, []);

  // additionally, use pointer event to make sure the switching of pointer devices
  // in case the user has multiple on system
  useEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") {
      setInputMode("touch");
      return;
    }
    setInputMode("mouse");
  });

  return inputMode;
}
