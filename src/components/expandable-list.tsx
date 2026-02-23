import type { ExpandableList as ExpandableListType } from "@/types/content";

type ExpandableListProps = {
  list: ExpandableListType;
};

export function ExpandableList({ list }: ExpandableListProps) {
  const visibleItems = list.items.slice(0, list.defaultVisibleCount);
  const hiddenItems = list.items.slice(list.defaultVisibleCount);

  return (
    <div>
      <h3 className="text-2xl font-semibold">{list.title}</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label={list.title}>
        {visibleItems.map((item) => (
          <li key={item} className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
      {hiddenItems.length > 0 ? (
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold text-[var(--wood-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
            {list.expandLabel}
          </summary>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label={`${list.title} uitgebreid`}>
            {hiddenItems.map((item) => (
              <li key={item} className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
