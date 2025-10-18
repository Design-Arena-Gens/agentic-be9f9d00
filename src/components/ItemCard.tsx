"use client";

import { Item } from "@/lib/types";

type Props = {
  item: Item;
  onClick: (item: Item) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, item: Item) => void;
};

export default function ItemCard({ item, onClick, draggable, onDragStart }: Props) {
  return (
    <div
      className="group relative cursor-pointer select-none"
      draggable={draggable}
      onDragStart={(e) => {
        onDragStart?.(e, item);
      }}
      onClick={() => onClick(item)}
    >
      <div
        className="overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-lg backdrop-blur-md transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl"
      >
        <div className="aspect-[2/3] w-full bg-white/5">
          {item.posterUrl ? (
            // using native img to avoid external domain config
            <img
              src={item.posterUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
              No Poster
            </div>
          )}
        </div>
        <div className="p-2">
          <div className="line-clamp-2 text-[13px] font-medium text-white/90">
            {item.title}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
              {item.type === "movie" ? "Movie" : "TV"}
            </span>
            {item.rating ? (
              <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {item.rating}/10
              </span>
            ) : (
              <span className="text-[11px] text-white/50">Rate</span>
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 transition-opacity duration-200 group-hover:ring-white/30" />
    </div>
  );
}
