import {
  AssetCarousel as AssetCarouselImport,
  AssetCarouselItem,
} from "./carousel";

type AssetCarouselType = typeof AssetCarouselImport & {
  item: typeof AssetCarouselItem;
  displayName: string;
};

const AssetCarousel: AssetCarouselType = Object.assign(AssetCarouselImport, {
  item: AssetCarouselItem,
  displayName: "Asset Carousel",
});

export default AssetCarousel;
