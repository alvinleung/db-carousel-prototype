import { MotionValue } from "motion";
import { cn } from "../ui/utils";
import { motion, useTransform } from "motion/react";

export const PageIndicator = ({
  pages,
  currentSlideContinuous,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  pages: number;
  currentSlideContinuous: MotionValue;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-0.5 h-5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: pages }).map((_, index) => (
        <PageIndicatorItem
          key={index}
          index={index}
          currentSlideContinuous={currentSlideContinuous}
        />
      ))}
    </div>
  );
};

const PageIndicatorItem = ({
  currentSlideContinuous,
  index,
}: {
  currentSlideContinuous: MotionValue;
  index: number;
}) => {
  const progress = useTransform(
    currentSlideContinuous,
    [index - 1, index, index + 1],
    [0, 0.5, 1],
  );

  const scale = useTransform(progress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const opacity = useTransform(progress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const textOpacity = useTransform(progress, [0, 0.5, 1], [0.0, 1, 0.0]);

  return (
    <motion.button
      key={index}
      className={cn(
        `size-5 text-[10px] font-var-bold rounded-full text-(--bg) bg-(--fg)`,
        // { "shadow-sm": current === index },
      )}
      style={{
        opacity,
        scale,
      }}
      aria-hidden
      tabIndex={-1}
    >
      <motion.span style={{ opacity: textOpacity }}>{index + 1}</motion.span>
    </motion.button>
  );
};
