import { range } from "es-toolkit";
import { twMerge } from "tailwind-merge";

export default function PageIndicator({
  maxPage,
  curPage,
}: {
  maxPage: number;
  curPage: number;
}) {
  return (
    <ul className="mt-1 inline-flex gap-[1px]">
      {range(maxPage).map((index) => (
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
