import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import { getCssVar } from "@/lib/sw-toolkit/utils/style.ts";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import ScrollableSlider from "./ScrollableSlider.tsx";
import StaticSlider from "./StaticSlider.tsx";
import classes from "./slider.module.css";

export default function Slider({
  sources,
  className,
  headerText,
}: React.ComponentProps<"div"> & { sources: string[]; headerText: string }) {
  const [itemCapacity, setItemCapacity] = useState(2);

  const handleBreakpoint = useRefCallback(({ defer, element }) => {
    const breakPoints = [640, 768, 1024, 1280];
    const mediaQueries = breakPoints.map((bp) =>
      window.matchMedia(`(min-width: ${bp}px)`),
    );
    const handleMediaChange = () => {
      setItemCapacity(getCssVar(element, "--item-capacity") || 2);
    };
    mediaQueries.forEach((mql) =>
      mql.addEventListener("change", handleMediaChange),
    );
    defer(() => {
      mediaQueries.forEach((mql) =>
        mql.removeEventListener("change", handleMediaChange),
      );
    });
    handleMediaChange();
  }, []);

  return (
    <article
      className={twMerge(
        "flex flex-col pt-6",
        classes["responsive"],
        className,
      )}
      ref={handleBreakpoint}
    >
      {sources.length > itemCapacity ? (
        <ScrollableSlider
          headerText={headerText}
          sources={sources}
          itemCapacity={itemCapacity}
        />
      ) : (
        <StaticSlider headerText={headerText} sources={sources} />
      )}
    </article>
  );
}
