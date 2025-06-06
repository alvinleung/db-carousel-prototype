"use client";
import AssetCarousel from "@/components/carousel";
import { options, useFeatureFlag } from "@/components/ui/debug-console";

export default function Home() {
  const titleBarAlignment = useFeatureFlag({
    label: "Title bar alignment",
    values: options(["edge", "safe-area", "center-column"]),
  });

  const withArrows = useFeatureFlag({
    label: "With Arrows",
    values: options(["yes", "no"]),
  });

  const currPreset = useFeatureFlag({
    label: "Content",
    values: options(["preset1", "preset2"]),
  });

  const transition = useFeatureFlag({
    label: "Transition",
    values: options(["fade", "scroll"]),
  });

  const preset = {
    preset1: {
      theme: {
        fg: "rgba(43,57,10,.7)",
        bg: "#FCFAFB",
        tagBg: "rgba(52,79,47,.07)",
        tagFg: "rgba(43,57,10,.7)",
      },

      content: [
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-transparent-1.jpg",
        },
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-transparent-2.jpg",
        },
      ],
    },
    preset2: {
      theme: undefined,
      content: [
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-1.jpg",
        },
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-2.jpg",
        },
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-3.jpg",
        },
        {
          caption:
            "Why are there so many buttons... I just want Anthropic to run my prompt...",
          src: "/asset-content-4.jpg",
        },
      ],
    },
  };

  return (
    <main className="py-8 px-4 text-lg font-medium">
      <p className="max-w-[calc(530px+32px)] mx-auto my-8 px-4">
        When users initially encounter a technical tool, they can often be
        overwhelmed by complexity. In Adaline’s early experiences, newcomers
        encountered a tangle of functionality: redundant UI elements, ambiguous
        icons, and controls layered with little regard for timing or task
        relevance. The result was a steep learnability curve that discouraged
        further exploration. 
      </p>
      <AssetCarousel
        title={"Initial product experience Analysis"}
        safeAreaWidth={906}
        safeAreaHeight={700}
        transition={transition}
        tag={"before"}
        arrows={withArrows === "yes"}
        titleBarAlignment={titleBarAlignment}
        theme={preset[currPreset].theme}
      >
        {preset[currPreset].content.map((item, index) => (
          <AssetCarousel.item
            key={index}
            src={item.src}
            caption={item.caption}
          />
        ))}
      </AssetCarousel>
      <p className="max-w-[calc(530px+32px)] mx-auto my-8 px-4">
        When users initially encounter a technical tool, they can often be
        overwhelmed by complexity. In Adaline’s early experiences, newcomers
        encountered a tangle of functionality: redundant UI elements, ambiguous
        icons, and controls layered with little regard for timing or task
        relevance. The result was a steep learnability curve that discouraged
        further exploration. 
      </p>
    </main>
  );
}
