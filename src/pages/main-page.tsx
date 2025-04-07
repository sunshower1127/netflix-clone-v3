import Slider from "@/components/slider/Slider.tsx";
import { getThumbnailImageURL } from "@/services/netflix-image-api.ts";
import { range } from "es-toolkit";

export default function MainPage() {
  return (
    <main className="flex w-dvw flex-col gap-10">
      <Slider
        headerText="헤더텍스트1"
        sources={range(10).map((i) => getThumbnailImageURL(i))}
      />
      <Slider
        headerText="헤더텍스트2"
        sources={range(10, 18).map((i) => getThumbnailImageURL(i))}
      />
      <Slider
        headerText="헤더텍스트3"
        sources={range(18, 21).map((i) => getThumbnailImageURL(i))}
      />
      <Slider
        headerText="헤더텍스트4"
        sources={range(21, 40).map((i) => getThumbnailImageURL(i))}
      />
      <Slider
        headerText="헤더텍스트5"
        sources={range(40, 80).map((i) => getThumbnailImageURL(i))}
      />
    </main>
  );
}
