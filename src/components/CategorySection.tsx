"use client";

import { CategoryFilter, CategoryKey, Item } from "@/lib/types";
import ItemCard from "./ItemCard";
import { useMemo } from "react";

const titles: Record<CategoryKey, string> = {
  currentlyWatching: "Currently Watching",
  planning: "Planning to Watch",
  watched: "Watched",
  dropped: "Dropped",
};

type Props = {
  category: CategoryKey;
  items: Item[];
  filter: CategoryFilter;
  onFilterChange: (category: CategoryKey, filter: CategoryFilter) => void;
  onOpen: (item: Item) => void;
  onDragStart: (item: Item, from: CategoryKey) => void;
  onDropItem: (to: CategoryKey, itemId: string, from: CategoryKey) => void;
};

export default function CategorySection({
  category,
  items,
  filter,
  onFilterChange,
  onOpen,
  onDragStart,
  onDropItem,
}: Props) {
  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.type === (filter === "movie" ? "movie" : "tv"));
  }, [items, filter]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const payload = e.dataTransfer.getData("text/plain");
    if (!payload) return;
    try {
      const { id, from } = JSON.parse(payload) as { id: string; from: CategoryKey };
      onDropItem(category, id, from);
    } catch {}
  }

  return (
    <section
      className="min-h-[260px] rounded-2xl border border-white/15 bg-white/5 p-3 shadow-xl backdrop-blur-lg"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white/90">{titles[category]}</h2>
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
          {(["all", "movie", "tv"] as CategoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(category, f)}
              className={
                "rounded-full px-2 py-1 text-xs transition " +
                (filter === f ? "bg-white text-black" : "text-white/80 hover:bg-white/20")
              }
            >
              {f === "all" ? "All" : f === "movie" ? "Movies" : "TV"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={onOpen}
            draggable
            onDragStart={(e) => {
              const payload = JSON.stringify({ id: item.id, from: category });
              e.dataTransfer.setData("text/plain", payload);
              e.dataTransfer.effectAllowed = "move";
            }}
          />
        ))}
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-white/20 p-6 text-center text-sm text-white/60">
            Drop items here
          </div>
        ) : null}
      </div>
    </section>
  );
}
