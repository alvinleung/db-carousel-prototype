import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useMemo } from "react";
import { createPathInterporlator } from "./interpolate-path";

function useAnimatedPath(paths: string[], targetProgress: number) {
  const pathInterporlator = useMemo(
    () => createPathInterporlator(paths),
    [paths],
  );

  const progress = useMotionValue(0);
  const progressSpring = useSpring(progress, { stiffness: 1500, damping: 100 });
  useEffect(() => {
    progress.set(targetProgress);
  }, [progress, targetProgress]);

  const animatedPath = useTransform(progressSpring, pathInterporlator);

  return animatedPath;
}

const CarouselArrowRight = ({
  isFlat,
  ...props
}: React.HTMLProps<SVGSVGElement> & { isFlat?: boolean }) => {
  const flatPath = "M 3 3 L 3 19.2441 C 3 22.1218 3 25.3167 3 28 L 3 43";
  const curvedPath =
    "M3 3L9.26966 19.2441C10.3803 22.1218 10.3402 25.3167 9.15769 28.1656L3 43";
  const animatedPath = useAnimatedPath([flatPath, curvedPath], isFlat ? 0 : 1);

  return (
    <svg
      width="13"
      height="46"
      viewBox="0 0 13 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        d={animatedPath}
        stroke="currentColor"
        strokeLinecap="round"
        animate={{
          strokeWidth: isFlat ? 2 : 3,
          // opacity: isFlat ? 0.5 : 1,
        }}
        strokeDashoffset={isFlat ? 1 : 0}
        strokeDasharray={isFlat ? 7 : 0}
      />
    </svg>
  );
};

const CarouselArrowLeft = ({
  isFlat,
  ...props
}: React.HTMLProps<SVGSVGElement> & { isFlat?: boolean }) => {
  const flatPath = "M 3 3 L 3 19.2441 C 3 22.1218 3 25.3167 3 28 L 3 43";
  const curvedPath =
    "M10 3L3.73034 19.2441C2.61965 22.1218 2.65975 25.3167 3.84231 28.1656L10 43";
  const animatedPath = useAnimatedPath([flatPath, curvedPath], isFlat ? 0 : 1);

  return (
    <svg
      width="13"
      height="46"
      viewBox="0 0 13 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        d={animatedPath}
        stroke="currentColor"
        strokeLinecap="round"
        animate={{
          strokeWidth: isFlat ? 2 : 3,
          // opacity: isFlat ? 0.5 : 1,
        }}
        strokeDashoffset={isFlat ? 1 : 0}
        strokeDasharray={isFlat ? 7 : 0}
      />
    </svg>
  );
};
export { CarouselArrowRight, CarouselArrowLeft };
