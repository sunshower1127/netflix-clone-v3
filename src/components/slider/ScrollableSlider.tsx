import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@iconify/react/dist/iconify.js";
import { delay, range } from "es-toolkit";
import Item from "./Item.tsx";
import PageIndicator from "./PageIndicator.tsx";
import classes from "./slider.module.css";

export default function ScrollableSlider({
  sources,
  headerText,
  itemCapacity,
}: React.ComponentProps<"div"> & {
  sources: string[];
  headerText: string;
  itemCapacity: number;
}) {
  const itemLength = sources.length;
  const [index, setIndex] = useState(0);

  const [firstTouch, setFirstTouch] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  const handlePageScroll = async (opt: "left" | "right") => {
    let newIndex: number;

    setIsScrolling(true);

    if (opt === "left") {
      if (index === 0) {
        newIndex = itemLength - itemCapacity;
        setScrollX(-itemCapacity);
      } else {
        newIndex = Math.max(0, index - itemCapacity);
        setScrollX(newIndex - index);
      }
    } else {
      if (index === itemLength - itemCapacity) {
        newIndex = 0;
        setScrollX(itemCapacity);
      } else {
        newIndex = Math.min(itemLength - itemCapacity, index + itemCapacity);
        setScrollX(newIndex - index);
      }
    }

    await delay(700);
    setFirstTouch(true);
    setIndex(newIndex);
    setIsScrolling(false);
    setScrollX(0);
  };

  return (
    <>
      <header className="flex w-full flex-row justify-between px-[calc(var(--button-width)+4px)]">
        <h6 className="text-xs font-light sm:text-sm md:text-base lg:text-lg xl:text-xl">
          {headerText}
        </h6>
        <PageIndicator
          maxPage={Math.ceil(itemLength / itemCapacity)}
          curPage={Math.ceil(index / itemCapacity)}
        />
      </header>
      <nav className="group/nav relative overflow-x-hidden py-1">
        <button
          className={twMerge(
            "group/btn absolute top-0 left-0 z-10 h-full w-(--button-width) cursor-pointer rounded-r-xs bg-black/50 hover:bg-black/70",
            !firstTouch && "hidden",
          )}
          disabled={isScrolling}
          onClick={() => handlePageScroll("left")}
        >
          <Icon
            icon="material-symbols-light:chevron-left"
            className="invisible size-4 h-7 w-(--button-width) scale-y-150 transition-transform group-hover/btn:scale-x-150 group-hover/btn:scale-y-200 group-hover/nav:visible"
          />
        </button>

        <ul
          className={twMerge(
            "flex flex-row gap-1",
            classes.scroll,
            isScrolling ? "transition-transform duration-700" : "",
          )}
          style={{
            transform: `translateX(var(--scroll-${scrollX}))`,
            transitionTimingFunction: "cubic-bezier(.45,.91,.55,.97)",
          }}
        >
          {range(itemCapacity + 1).map((i) => {
            const indexBefore =
              (index - (itemCapacity - i + 1) + 2 * itemLength) % itemLength;
            return (
              <Item
                className={!firstTouch ? "invisible" : ""}
                key={indexBefore}
                source={sources[indexBefore]}
              />
            );
          })}
          {range(itemCapacity).map((i) => (
            <Item key={i} source={sources[index + i]} />
          ))}
          {range(itemCapacity + 1).map((i) => {
            const indexAfter = (index + i + itemCapacity) % itemLength;
            return <Item key={indexAfter} source={sources[indexAfter]} />;
          })}
        </ul>
        <button
          className="group/btn absolute top-0 right-0 z-10 h-full w-(--button-width) cursor-pointer rounded-l-xs bg-black/50 hover:bg-black/70"
          disabled={isScrolling}
          onClick={() => handlePageScroll("right")}
        >
          <Icon
            icon="material-symbols-light:chevron-right"
            className="invisible size-4 h-7 w-(--button-width) scale-y-150 transition-transform group-hover/btn:scale-x-150 group-hover/btn:scale-y-200 group-hover/nav:visible"
          />
        </button>
      </nav>
    </>
  );
}
