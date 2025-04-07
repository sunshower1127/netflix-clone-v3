import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import { getCssVar } from "@/lib/sw-toolkit/utils/style.ts";
import { AnimatePresence, motion, MotionStyle } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@iconify/react/dist/iconify.js";
import { delay, range } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { createPortal } from "react-dom";
import classes from "./slider.module.css";

export default function Slider({
  sources,
  className,
  headerText,
}: React.ComponentProps<"div"> & { sources: string[]; headerText: string }) {
  const itemLength = sources.length;
  const [index, setIndex] = useState(0);
  const [itemCapacity, setItemCapacity] = useState(2);
  const [firstTouch, setFirstTouch] = useState(false);
  const isScrollNeeded = itemLength > itemCapacity;
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollX, setScrollX] = useState(0);

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
  }, []); // PASSED

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
    <article
      className={twMerge(
        "flex flex-col pt-6",
        classes["responsive"],
        className,
      )}
      ref={handleBreakpoint}
    >
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
            !isScrollNeeded || !firstTouch ? "hidden" : "",
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
          className={twMerge(
            "group/btn absolute top-0 right-0 z-10 h-full w-(--button-width) cursor-pointer rounded-l-xs bg-black/50 hover:bg-black/70",
            !isScrollNeeded ? "hidden" : "",
          )}
          disabled={isScrolling}
          onClick={() => handlePageScroll("right")}
        >
          <Icon
            icon="material-symbols-light:chevron-right"
            className="invisible size-4 h-7 w-(--button-width) scale-y-150 transition-transform group-hover/btn:scale-x-150 group-hover/btn:scale-y-200 group-hover/nav:visible"
          />
        </button>
      </nav>
    </article>
  );
}

function Item({ source, className }: { source: string; className?: string }) {
  const [isHover, setHover] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rectRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHover(true);
      timeoutRef.current = null;
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setHover(false);
    }
  }, []);

  const getButtonWidth = useCallback(() => {
    const buttonWidth = getCssVar(rectRef.current!, "--button-width")!;
    return buttonWidth;
  }, []);

  const getRect = useCallback(
    () => rectRef.current!.getBoundingClientRect(),
    [],
  );

  return (
    <li className={twMerge("w-(--item-width) cursor-pointer", className)}>
      <div className="w-full bg-red-400" />
      <img
        ref={rectRef}
        className={twMerge("aspect-video w-full cursor-pointer rounded-xs")}
        src={source}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {createPortal(
        <AnimatePresence>
          {isHover && (
            <Card
              url={source}
              getButtonWidth={getButtonWidth}
              getRect={getRect}
              onMouseLeave={() => setHover(false)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </li>
  );
}

function Card({
  url,
  getRect,
  getButtonWidth,
  ...props
}: { url: string; getButtonWidth: () => number; getRect: () => DOMRect } & Omit<
  React.ComponentProps<"div">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
>) {
  const [style, setStyle] = useState<MotionStyle>({});

  useEffect(() => {
    const rect = getRect();
    const top = rect.top + window.scrollY;

    const buttonWidth = getButtonWidth();

    let transformOrigin = "center";
    if (rect.left < buttonWidth + 10) {
      transformOrigin = "left";
    } else if (rect.right > window.innerWidth - buttonWidth - 10) {
      transformOrigin = "right";
    }
    const left = rect.left;
    const width = rect.width;

    setStyle({
      top,
      left,
      width,
      transformOrigin,
    });
  }, [getButtonWidth, getRect]);

  if (isEmpty(style)) return null;

  return (
    <motion.div
      className="absolute z-30 flex flex-col items-center rounded-xs bg-zinc-900 shadow-lg shadow-black"
      style={style}
      initial={{ scale: 1 }}
      animate={{ scale: 1.5 }}
      exit={{ scale: 1 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      <img className="aspect-video w-full rounded-xs" src={url} />
      <motion.div
        className="flex w-full flex-col items-center gap-2 p-3 text-[0.7rem] font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center gap-1">
            <Icon
              icon="material-symbols-light:play-circle-rounded"
              className="size-8"
            />
            <Icon
              icon="material-symbols-light:check-circle-outline"
              className="size-8"
            />
            <Icon
              icon="pepicons-pencil:thumbs-up-circle"
              className="mx-1 size-[1.6rem]"
            />
          </div>
          <Icon
            icon="material-symbols-light:expand-circle-down-outline"
            className="size-8"
          />
        </div>
        <p className="w-full">에피소드 25개</p>
        <p className="w-full">진심어린 로맨틱 첫사랑</p>
      </motion.div>
    </motion.div>
  );
}

function PageIndicator({
  maxPage,
  curPage,
}: {
  maxPage: number;
  curPage: number;
}) {
  return (
    <ul className="mt-1 inline-flex gap-[1px]">
      {Array.from({ length: maxPage }).map((_, index) => (
        <li
          className={twMerge(
            "inline-flex h-0.5 w-3 bg-zinc-600",
            index === curPage && "bg-zinc-400",
          )}
          key={index}
        />
      ))}
    </ul>
  );
}
