import { useRef } from "react";
import { useState } from "react";
import { clamp, useMotionValue } from "motion/react";
import { useSpring } from "motion/react";
import { RefObject } from "react";
import { useEventListener } from "usehooks-ts";

const DEFAULT_OPTION = {
  drag: true,
  touch: true,
  wheel: true,
};

/**
 * Custom hook that implements scroll and drag behavior for a container element
 * Handles mouse drag, touch drag, and wheel scroll interactions
 */
export function useScrollDrag<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options?: { drag?: boolean; touch?: boolean; wheel?: boolean }
) {
  const { drag, touch, wheel } = Object.assign({ ...DEFAULT_OPTION }, options);

  // Track whether user is currently dragging
  const [isDragging, setIsDragging] = useState(false);

  // Motion value for scroll position
  const scroll = useMotionValue(0);
  // Spring animation for smooth scrolling
  const scrollSpring = useSpring(scroll, {
    stiffness: 2000,
    damping: 200,
  });

  const clampScroll = (latest: number) => {
    return clamp(-2000, 0, latest);
  };

  // Handle mouse drag movement
  useEventListener("mousemove", (e: MouseEvent) => {
    if (!drag) return;
    if (!isDragging) return;

    // Scale movement based on viewport width
    const widthFactor = 1920 / window.innerWidth;
    const clamped = clampScroll(
      scroll.get() + e.movementX * 0.002 * widthFactor
    );
    scroll.set(clamped);
  });

  // Track touch position for touch drag
  const lastTouchX = useRef(0);

  // Handle touch drag movement
  useEventListener("touchmove", (e: TouchEvent) => {
    if (!touch) return;
    if (isDragging) {
      const widthFactor = 1920 / window.innerWidth;
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - lastTouchX.current;
      lastTouchX.current = touchX;
      const clamped = clampScroll(scroll.get() + deltaX * 0.002 * widthFactor);
      scroll.set(clamped);
    }
  });

  // Stop dragging when mouse/touch interaction ends
  useEventListener("mouseup", () => setIsDragging(false));
  useEventListener("mouseleave", () => setIsDragging(false));
  useEventListener("touchend", () => setIsDragging(false));
  useEventListener("touchcancel", () => setIsDragging(false));

  // Handle horizontal mouse wheel scrolling
  useEventListener("wheel", (e: WheelEvent) => {
    if (!wheel) return;
    const clamped = clampScroll(scroll.get() - e.deltaX * 0.002);
    scroll.set(clamped);
  });

  // Start dragging on mouse down within container
  useEventListener(
    "mousedown",
    () => {
      if (!drag) return;
      setIsDragging(true);
    },
    containerRef as RefObject<T>
  );

  // Start dragging on touch start within container
  useEventListener(
    "touchstart",
    (e: TouchEvent) => {
      if (!touch) return;
      setIsDragging(true);
      lastTouchX.current = e.touches[0].clientX;
    },
    containerRef as RefObject<T>
  );

  return { scroll, scrollSpring, isDragging };
}
