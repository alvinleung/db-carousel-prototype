import AssetCarousel from "@/components/carousel";

export default function Home() {
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
        transition="fade"
        tag={"before"}
        titleBarAlignment="safe-area"
        theme={{
          fg: "rgba(43,57,10,.7)",
          bg: "#FCFAFB",
          tagBg: "rgba(52,79,47,.07)",
          tagFg: "rgba(43,57,10,.7)",
        }}
      >
        <AssetCarousel.item
          src={"/asset-content-transparent-1.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
        <AssetCarousel.item
          src={"/asset-content-transparent-2.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
      </AssetCarousel>
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
        transition="scroll"
        tag={"before"}
      >
        <AssetCarousel.item
          src={"/asset-content-1.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
        <AssetCarousel.item
          src={"/asset-content-2.jpg"}
          caption={"Wait... they are purely repeat of each other?"}
        />
        <AssetCarousel.item
          src={"/asset-content-3.jpg"}
          caption={"Does it really tell me anything new here?"}
        />
        <AssetCarousel.item
          src={"/asset-content-3.jpg"}
          caption={"Does anyone really know what these icons do?"}
        />
        <AssetCarousel.item
          src={"/asset-content-zoomed.jpg"}
          caption={"This is a zoom test"}
        />
      </AssetCarousel>
      <p className="max-w-[calc(530px+32px)] mx-auto my-8 px-4">
        When users initially encounter a technical tool, they can often be
        overwhelmed by complexity. In Adaline’s early experiences, newcomers
        encountered a tangle of functionality: redundant UI elements, ambiguous
        icons, and controls layered with little regard for timing or task
        relevance. The result was a steep learnability curve that discouraged
        further exploration. 
      </p>
      <AssetCarousel
        title={"This carousel uses fade transition"}
        tag={"demo"}
        safeAreaWidth={906}
        safeAreaHeight={700}
      >
        <AssetCarousel.item
          src={"/asset-content-1.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
        <AssetCarousel.item
          src={"/asset-content-2.jpg"}
          caption={"Wait... they are purely repeat of each other?"}
        />
        <AssetCarousel.item
          src={"/asset-content-3.jpg"}
          caption={"Does it really tell me anything new here?"}
        />
      </AssetCarousel>
      <p className="max-w-[calc(530px+32px)] mx-auto my-8 px-4">
        When users initially encounter a technical tool, they can often be
        overwhelmed by complexity. In Adaline’s early experiences, newcomers
        encountered a tangle of functionality: redundant UI elements, ambiguous
        icons, and controls layered with little regard for timing or task
        relevance. The result was a steep learnability curve that discouraged
        further exploration. 
      </p>
      <AssetCarousel
        tag={"Demo"}
        title={"This carousel uses alignment center-column"}
        titleBarAlignment="center-column"
        transition="scroll"
      >
        <AssetCarousel.item
          src={"/asset-content-1.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
        <AssetCarousel.item
          src={"/asset-content-2.jpg"}
          caption={"Wait... they are purely repeat of each other?"}
        />
        <AssetCarousel.item
          src={"/asset-content-3.jpg"}
          caption={"Does it really tell me anything new here?"}
        />
      </AssetCarousel>

      <p className="max-w-[calc(530px+32px)] mx-auto my-8 px-4">
        When users initially encounter a technical tool, they can often be
        overwhelmed by complexity. In Adaline’s early experiences, newcomers
        encountered a tangle of functionality: redundant UI elements, ambiguous
        icons, and controls layered with little regard for timing or task
        relevance. The result was a steep learnability curve that discouraged
        further exploration. 
      </p>
      <AssetCarousel
        tag={"Demo"}
        title={"This carousel uses safe-area alignment"}
        titleBarAlignment="safe-area"
        transition="scroll"
      >
        <AssetCarousel.item
          src={"/asset-content-1.jpg"}
          caption={
            "Why are there so many buttons... I just want Anthropic to run my prompt..."
          }
        />
        <AssetCarousel.item
          src={"/asset-content-2.jpg"}
          caption={"Wait... they are purely repeat of each other?"}
        />
        <AssetCarousel.item
          src={"/asset-content-3.jpg"}
          caption={"Does it really tell me anything new here?"}
        />
      </AssetCarousel>
    </main>
  );
}
