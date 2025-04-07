import useRefCallback from "@/lib/sw-toolkit/hooks/useRefCallback.ts";
import { Icon } from "@iconify/react/dist/iconify.js";
import { inRange, throttle } from "es-toolkit";
import { MotionStyle, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function HoverCard({
  url,
  rect,
  buttonWidth,
  close,
  ...props
}: {
  url: string;
  buttonWidth: number;
  rect: DOMRect;
  close: () => void;
} & Omit<
  React.ComponentProps<"div">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
>) {
  const [style, setStyle] = useState<MotionStyle>({});

  useEffect(() => {
    const top = rect.top + window.scrollY;

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
  }, [buttonWidth, rect.left, rect.right, rect.top, rect.width]);

  const handleRef = useRefCallback(({ element, defer }) => {
    let mouseX = 0;
    let mouseY = 0;

    const closeIfOutOfBounds = () => {
      const hoverCardRect = element.getBoundingClientRect();
      if (mouseX === 0 && mouseY === 0) return;
      if (hoverCardRect.x === 0 && hoverCardRect.y === 0) return;

      if (inRange(mouseX, hoverCardRect.left, hoverCardRect.right)) return;
      if (inRange(mouseY, hoverCardRect.top, hoverCardRect.bottom)) return;

      close();
    };

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (e.clientX === 0 && e.clientY === 0) return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      closeIfOutOfBounds();
    }, 50); // 20fps

    const handleScroll = throttle(() => {
      closeIfOutOfBounds();
    }, 50); // 20fps

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    defer(() => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    });
  }, []);

  return (
    <motion.div
      ref={handleRef}
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
