"use client";

import React, {
  CSSProperties,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useResizeObserver } from "usehooks-ts";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "../ui/utils";
import { CarouselArrowLeft, CarouselArrowRight } from "./arrow";
import { useInputMode } from "./use-input-mode";

const DefaultTheme = {
  bg: "#F1F3EF",
  fg: "#2B390A",
  tagBg: "#2B6B5E",
  tagFg: "var(--color-gray-50)",
};

interface AssetCarouselProps {
  children: React.ReactElement<AssetCarouselItemProps>[];
  title?: string;
  tag?: string;
  safeAreaWidth?: number;
  safeAreaHeight?: number;
  theme?: typeof DefaultTheme;
}

// ease out expo
export const EASE_OUT = [0.16, 1, 0.3, 1];
// ease in expo
export const EASE_IN = [0.7, 0, 0.84, 0];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];

const AssetCarousel = ({
  children,
  title,
  tag,
  safeAreaWidth = 906,
  safeAreaHeight = 700,
  theme = DefaultTheme,
}: AssetCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerDim = useResizeObserver({
    ref: scrollContainerRef as RefObject<HTMLDivElement>,
  });
  const scrollContainerWidth = scrollContainerDim.width || 0;
  const slidesCount = React.Children.count(children);

  // values that help determine caption size
  const allCaptions = React.Children.map(
    children,
    (child) => child.props.caption,
  );
  const longestCaption = useMemo(
    () =>
      allCaptions.reduce(
        (acc, curr, index) => {
          if (curr.length > acc.length) {
            return {
              index,
              length: curr.length,
            };
          }
          return acc;
        },
        { index: 0, length: 0 },
      ),
    [allCaptions],
  );

  // enable navigation mode toggle
  const inputMode = useInputMode();
  const showNavigationButton = inputMode === "mouse" || inputMode === undefined;

  // handle the scrolling logic
  const [current, setCurrent] = useState<number>(0);
  const canGoNext = current < slidesCount - 1;
  const canGoPrev = current > 0;

  const { scrollX } = useScroll({ container: scrollContainerRef });
  useMotionValueEvent(scrollX, "change", (scroll) => {
    // determine the current item
    const currPage = Math.round(scroll / scrollContainerWidth);
    setCurrent(currPage);
  });

  // function for changing slide
  const moveSlide = useCallback(
    (increment: number) => {
      const incremented = current + increment;

      // do a safe mod for dealing with negative number
      const next = ((incremented % slidesCount) + slidesCount) % slidesCount;

      const targetScroll = scrollContainerWidth * next;
      scrollContainerRef.current?.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    },
    [current, slidesCount, scrollContainerWidth],
  );

  const hasTitleBar = title || tag;

  return (
    <figure
      aria-roledescription="carousel"
      tabIndex={-1}
      className="relative"
      // for tabbing
      onFocus={() => {
        scrollContainerRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }}
      style={
        {
          "--margin": "calc(var(--spacing)*4)",
          "--safe-area-w": safeAreaWidth,
          "--safe-area-h": safeAreaHeight,
          "--safe-area-w-px": "calc(var(--safe-area-w)*1px)",
          "--safe-area-h-px": "calc(var(--safe-area-h)*1px)",
          "--bg": theme.bg,
          "--fg": theme.fg,
          "--tag-bg": theme.tagBg,
          "--tag-fg": theme.tagFg,
        } as CSSProperties
      }
    >
      {/* The main container */}
      <div
        className={cn(
          "overflow-hidden relative rounded-3xl max-w-[1664px] mx-auto",
          "bg-(--bg) text-(--fg)",
          "outline-0 transition-all has-focus-visible:outline-4 outline-(--fg)/30",
        )}
      >
        {/* the header module */}
        {hasTitleBar && (
          <div className="z-10 pt-(--margin) px-(--margin) flex flex-row items-center">
            {tag && (
              <div className="absolute uppercase tracking-widest left-(--margin) top-(--margin) text-xs items-center flex rounded-full bg-(--tag-bg) text-(--tag-fg) px-2.5 h-6">
                {tag}
              </div>
            )}
            {title && (
              <div
                className={cn(
                  " text-left font-var-medium text-base",
                  tag ? "w-[530px] mx-auto px-24" : "",
                )}
              >
                {title}
              </div>
            )}
            <div className="absolute right-(--margin) top-(--margin) text-xs items-center flex rounded-full px-2.5 h-6">
              {/* placeholder for top right */}
            </div>
          </div>
        )}

        {/* The image itself */}
        <div className="relative">
          {/* spacer that hold the aspect ratio and size */}
          <div
            style={{
              // constrain the max aspect ratio
              aspectRatio: "calc(var(--safe-area-w)/var(--safe-area-h))",
              // constrain height after growing a certain width
              maxHeight: "var(--safe-area-h-px)",
              // padding on the sides
              marginLeft: showNavigationButton
                ? "calc(var(--margin)*3)"
                : "var(--margin)",
              marginRight: showNavigationButton
                ? "calc(var(--margin)*3)"
                : "var(--margin)",
            }}
          />
          <div
            ref={scrollContainerRef}
            className="overscroll-x-none overflow-x-scroll no-scrollbar absolute inset-0 snap-x snap-mandatory"
            aria-live="off"
            tabIndex={-1}
            role="tablist"
          >
            <div className="flex flex-row h-full">
              {React.Children.map(children, (child, index) => {
                return (
                  <motion.div
                    key={index}
                    className="h-full min-w-full focus-visible:opacity-100"
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slidesCount}`}
                    aria-describedby={`slide-${index}-caption`}
                    tabIndex={0}
                    style={
                      {
                        "--carousel-index": index,
                      } as CSSProperties
                    }
                  >
                    {child}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <PageIndicator
              pages={React.Children.count(children)}
              current={current}
            />
          </div>

          {/* Right Arrow */}
          {showNavigationButton && (
            <ArrowButton
              direction="right"
              enabled={canGoNext}
              onClick={() => canGoNext && moveSlide(1)}
              className={"absolute right-0 top-0 bottom-0 "}
            />
          )}

          {/* Left Arrow */}
          {showNavigationButton && (
            <ArrowButton
              direction="left"
              enabled={canGoPrev}
              onClick={() => canGoPrev && moveSlide(-1)}
              className={"absolute left-0 top-0 bottom-0"}
            />
          )}
        </div>
      </div>

      {/* bottom caption */}
      <div className="py-(--margin) px-(--margin) flex flex-col items-center gap-2">
        <motion.figcaption className="relative opacity-70 max-w-[530px] text-center mx-auto text-sm">
          {allCaptions.map((caption, index) => (
            <motion.div
              key={index}
              aria-live="polite"
              aria-hidden={index === current}
              id={`slide-${index}-caption`}
              className={cn(
                "text-center",
                // use the longest caption to act as a holder for height
                // to prevent shifting layout when there are some of the caption
                // being multiline
                longestCaption.index === index
                  ? "relative"
                  : "absolute top-0 left-0 right-0",
              )}
              animate={{
                opacity: index === current ? 1 : 0,
                x: index === current ? 0 : index > current ? 24 : -24,
                transition: {
                  duration: 0.3,
                  ease: EASE_OUT,
                },
              }}
            >
              {caption}
            </motion.div>
          ))}
        </motion.figcaption>
      </div>
    </figure>
  );
};

interface ArrowButtonProps {
  enabled: boolean;
  onClick: () => void;
  className: string;
  direction: "left" | "right";
}

const ArrowButton = ({
  direction,
  enabled,
  onClick,
  className,
}: ArrowButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const dir = direction === "left" ? -1 : 1;

  return (
    <motion.button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className={cn(
        enabled && "cursor-pointer",
        "w-1/6 flex items-center",
        direction === "left"
          ? "pl-(--margin) justify-start"
          : "pr-(--margin) justify-end",
        className,
      )}
      onPointerDown={() => setIsPressing(true)}
      onPointerUp={() => setIsPressing(false)}
      aria-hidden
      tabIndex={-1}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovering ? 1 : 0.2,
          x: enabled ? (isPressing ? 7 * dir : isHovering ? 0 : 4 * dir) : 0,
          scaleY: enabled && isPressing ? 0.95 : 1,
          scaleX: enabled && isPressing ? 1.2 : 1,
        }}
      >
        {direction === "left" ? (
          <CarouselArrowLeft isFlat={!enabled} />
        ) : (
          <CarouselArrowRight isFlat={!enabled} />
        )}
      </motion.span>
    </motion.button>
  );
};

interface AssetCarouselItemProps {
  src: string;
  caption: string;
}
const AssetCarouselItem = ({ src, caption }: AssetCarouselItemProps) => {
  return (
    <Image
      className="h-full object-cover snap-center"
      src={src}
      alt={caption}
      width={1664}
      height={700}
    />
  );
};

const PageIndicator = ({
  pages,
  current,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  numbers?: boolean; // should we show numbers
  pages: number;
  current: number;
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
        <motion.button
          key={index}
          className={cn(
            `size-5 text-[10px] font-var-bold rounded-full text-(--bg) bg-(--fg)`,
            { "shadow-sm": current === index },
          )}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: current === index ? 1 : 0.4,
            scale: current === index ? 1 : 0.3,
          }}
          aria-hidden
          tabIndex={-1}
          transition={{
            duration: 0.5,
            ease: EASE_OUT,
          }}
        >
          <motion.span
            animate={{
              opacity: current === index ? 1 : 0,
            }}
          >
            {index + 1}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
};

export { AssetCarousel, AssetCarouselItem };
