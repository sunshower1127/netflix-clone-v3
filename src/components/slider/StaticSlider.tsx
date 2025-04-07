import Item from "./Item.tsx";

export default function StaticSlider({
  sources,
  headerText,
}: React.ComponentProps<"div"> & { sources: string[]; headerText: string }) {
  return (
    <>
      <header className="flex w-full flex-row justify-between px-[calc(var(--button-width)+4px)]">
        <h6 className="text-xs font-light sm:text-sm md:text-base lg:text-lg xl:text-xl">
          {headerText}
        </h6>
      </header>
      <nav className="group/nav overflow-x-hidden py-1">
        <ul className="flex translate-x-[calc(var(--button-width)+4px)] flex-row gap-1">
          {sources.map((source, i) => (
            <Item key={i} source={source} />
          ))}
        </ul>
      </nav>
    </>
  );
}
